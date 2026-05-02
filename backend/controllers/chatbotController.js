const { generateInviteCode } = require('../utils/inviteCode');
const pool = require('../config/db');
const gemini = require('../services/geminiService');

// POST /api/chatbot/message { message, session_id? }
exports.sendMessage = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { message } = req.body;
    let session_id = req.body.session_id || null;
    if (!message) return res.status(400).json({ success: false, message: 'Mensaje requerido' });

    // crear/validar sesión
    if (!session_id) {
      const [s] = await conn.query(
        'INSERT INTO chat_sessions (user_id, title) VALUES (?, ?)',
        [req.user.id, message.slice(0, 60)]
      );
      session_id = s.insertId;
    } else {
      const [owns] = await conn.query(
        'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ? LIMIT 1',
        [session_id, req.user.id]
      );
      if (!owns.length) return res.status(404).json({ success: false, message: 'Sesión no encontrada' });
    }

    // guardar mensaje del usuario
    await conn.query(
      'INSERT INTO chat_messages (session_id, user_id, role, content) VALUES (?, ?, ?, ?)',
      [session_id, req.user.id, 'user', message]
    );

    // cargar historial (últimos 20)
    const [history] = await conn.query(
      `SELECT role, content FROM chat_messages
        WHERE session_id = ? AND user_id = ?
        ORDER BY created_at ASC
        LIMIT 20`,
      [session_id, req.user.id]
    );

    // llamar a Gemini
    let reply;
    try {
      // pasamos el historial SIN el último mensaje (ya se lo damos aparte)
      reply = await gemini.chat(history.slice(0, -1), message);
    } catch (e) {
      console.error('gemini chat error', e);
      reply = 'Lo siento, el asistente no está disponible en este momento.';
    }

    await conn.query(
      'INSERT INTO chat_messages (session_id, user_id, role, content) VALUES (?, ?, ?, ?)',
      [session_id, req.user.id, 'assistant', reply]
    );

    return res.json({ success: true, data: { session_id, reply } });
  } catch (err) {
    console.error('sendMessage', err);
    return res.status(500).json({ success: false, message: 'Error del chatbot' });
  } finally {
    conn.release();
  }
};

// GET /api/chatbot/history?session_id=
exports.history = async (req, res) => {
  try {
    const session_id = req.query.session_id;
    if (!session_id) return res.status(400).json({ success: false, message: 'session_id requerido' });
    const [rows] = await pool.query(
      `SELECT id, session_id, role, content, created_at FROM chat_messages
        WHERE session_id = ? AND user_id = ?
        ORDER BY created_at ASC`,
      [session_id, req.user.id]
    );
    return res.json({ success: true, data: { messages: rows } });
  } catch (err) {
    console.error('history', err);
    return res.status(500).json({ success: false, message: 'Error historial' });
  }
};

// GET /api/chatbot/sessions
exports.listSessions = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, created_at FROM chat_sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    return res.json({ success: true, data: { sessions: rows } });
  } catch (err) {
    console.error('listSessions', err);
    return res.status(500).json({ success: false, message: 'Error sesiones' });
  }
};

// POST /api/chatbot/generate-project { prompt, createInDb?: boolean }
// Genera estructura con Gemini. Si createInDb=true, crea el proyecto + tareas en MySQL.
exports.generateProject = async (req, res) => {
  const { prompt, createInDb = false, color = 'lavender', icon = 'briefcase' } = req.body;
  if (!prompt || prompt.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Describe mejor tu idea (mín. 5 caracteres)' });
  }

  let structure;
  try {
    structure = await gemini.generateProjectStructure(prompt);
  } catch (err) {
    console.error('generateProjectStructure', err);
    return res.status(500).json({ success: false, message: 'No se pudo generar la estructura' });
  }

  if (!createInDb) {
    return res.json({ success: true, data: { structure, created: false } });
  }

  // Crear proyecto + tareas en MySQL en una transacción
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    let code;
    for (let i = 0; i < 6; i++) {
      code = generateInviteCode(6);
      const [dup] = await conn.query('SELECT id FROM projects WHERE invite_code = ?', [code]);
      if (!dup.length) break;
    }
    const [rp] = await conn.query(
      'INSERT INTO projects (name, description, color, icon, owner_id, invite_code) VALUES (?, ?, ?, ?, ?, ?)',
      [structure.project_name || 'Proyecto IA', structure.description || '', color, icon, req.user.id, code]
    );
    const projectId = rp.insertId;
    await conn.query(
      'INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, ?)',
      [req.user.id, projectId, 'ADMIN']
    );

    const tasks = Array.isArray(structure.tasks) ? structure.tasks : [];
    for (const t of tasks) {
      const priority = ['LOW', 'MEDIUM', 'HIGH'].includes(String(t.priority).toUpperCase()) 
                       ? t.priority.toUpperCase() 
                       : 'MEDIUM';

      await conn.query(
        `INSERT INTO tasks (title, description, project_id, created_by, priority, status)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          (t.title || 'Tarea sin título').slice(0, 100),
          t.description || '',
          projectId,
          req.user.id,
          priority,
          'PENDING'
        ]
      );
    }
    await conn.commit();

    const [prj] = await conn.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    const [trs] = await conn.query('SELECT * FROM tasks WHERE project_id = ?', [projectId]);
    return res.json({
      success: true,
      data: {
        created: true,
        project: { ...prj[0], role: 'ADMIN' },
        tasks: trs,
        structure,
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('generateProject create', err);
    return res.status(500).json({ success: false, message: 'Error creando proyecto generado' });
  } finally {
    conn.release();
  }
};