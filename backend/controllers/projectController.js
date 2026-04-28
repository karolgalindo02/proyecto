const pool = require('../config/db');
const { generateInviteCode } = require('../utils/inviteCode');
const { createNotification } = require('../services/NotificationService');
// POST /api/projects — el usuario se convierte en ADMIN del proyecto
exports.create = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const { name, description = '', color = 'lavender', icon = 'briefcase', start_date = null, end_date = null } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'El nombre del proyecto es requerido' });

    await conn.beginTransaction();

    // generar invite_code único
    let code;
    for (let i = 0; i < 6; i++) {
      code = generateInviteCode(6);
      const [dup] = await conn.query('SELECT id FROM projects WHERE invite_code = ?', [code]);
      if (!dup.length) break;
    }

    const [r] = await conn.query(
      'INSERT INTO projects (name, description, color, icon, owner_id, invite_code, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, color, icon, req.user.id, code, start_date, end_date]
    );
    const projectId = r.insertId;

    await conn.query(
      'INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, ?)',
      [req.user.id, projectId, 'ADMIN']
    );

    await conn.commit();
    const [rows] = await conn.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    return res.status(201).json({ success: true, data: { project: { ...rows[0], role: 'ADMIN' } } });
  } catch (err) {
    await conn.rollback();
    console.error('create project', err);
    return res.status(500).json({ success: false, message: 'Error al crear proyecto' });
  } finally {
    conn.release();
  }
};

// POST /api/projects/join — unirse mediante código
exports.joinByCode = async (req, res) => {
  try {
    const code = String(req.body?.code || '').toUpperCase().trim();
    if (!code) return res.status(400).json({ success: false, message: 'Código requerido' });

    const [rows] = await pool.query('SELECT * FROM projects WHERE invite_code = ? LIMIT 1', [code]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Código de proyecto inválido' });
    const project = rows[0];

    // verificar si ya es miembro
    const [m] = await pool.query(
      'SELECT role FROM project_members WHERE user_id = ? AND project_id = ? LIMIT 1',
      [req.user.id, project.id]
    );
    if (m.length) {
      return res.json({ success: true, data: { project: { ...project, role: m[0].role }, message: 'Ya eres miembro' } });
    }

    await pool.query(
      'INSERT INTO project_members (user_id, project_id, role) VALUES (?, ?, ?)',
      [req.user.id, project.id, 'MEMBER']
    );
    // 🔔 Notificar al admin que alguien se unió
    await createNotification({
      user_id: project.owner_id,
      type: 'PROJECT_JOIN',
      title: '¡Nuevo miembro en tu proyecto!',
      message: `${req.user.name} ${req.user.lastname || ''} se unió a \"${project.name}\"`,
      related_project_id: project.id,
      actor_id: req.user.id,
    });

    return res.json({ success: true, data: { project: { ...project, role: 'MEMBER' } } });
  } catch (err) {
    console.error('join project', err);
    return res.status(500).json({ success: false, message: 'Error al unirse al proyecto' });
  }
};

// GET /api/projects — listar proyectos donde el usuario es miembro, con progreso
exports.list = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, pm.role,
              (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS tasks_count,
              (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'DONE') AS tasks_done
         FROM projects p
         INNER JOIN project_members pm ON pm.project_id = p.id
        WHERE pm.user_id = ?
        ORDER BY p.created_at DESC`,
      [req.user.id]
    );
    const projects = rows.map((p) => ({
      ...p,
      tasks_count: Number(p.tasks_count) || 0,
      tasks_done: Number(p.tasks_done) || 0,
      progress: p.tasks_count > 0 ? Math.round((p.tasks_done / p.tasks_count) * 100) : 0,
    }));
    return res.json({ success: true, data: { projects } });
  } catch (err) {
    console.error('list projects', err);
    return res.status(500).json({ success: false, message: 'Error al listar proyectos' });
  }
};

// GET /api/projects/:id — detalle + miembros
exports.getById = async (req, res) => {
  try {
    const projectId = req.params.id;
    const [pm] = await pool.query(
      'SELECT role FROM project_members WHERE user_id = ? AND project_id = ? LIMIT 1',
      [req.user.id, projectId]
    );
    if (!pm.length) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });

    const [prows] = await pool.query('SELECT * FROM projects WHERE id = ?', [projectId]);
    if (!prows.length) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });

    const [members] = await pool.query(
      `SELECT u.id, u.name, u.lastname, u.email, u.image, pm.role
         FROM project_members pm
         JOIN users u ON u.id = pm.user_id
        WHERE pm.project_id = ?`,
      [projectId]
    );

    return res.json({
      success: true,
      data: { project: { ...prows[0], role: pm[0].role, members } },
    });
  } catch (err) {
    console.error('get project', err);
    return res.status(500).json({ success: false, message: 'Error al obtener proyecto' });
  }
};

// DELETE /api/projects/:id — solo admin/owner
exports.remove = async (req, res) => {
  try {
    const projectId = req.params.id;
    const [rows] = await pool.query('SELECT owner_id FROM projects WHERE id = ?', [projectId]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Proyecto no encontrado' });
    if (rows[0].owner_id !== req.user.id) return res.status(403).json({ success: false, message: 'Solo el admin puede eliminar' });
    await pool.query('DELETE FROM projects WHERE id = ?', [projectId]);
    return res.json({ success: true, message: 'Proyecto eliminado' });
  } catch (err) {
    console.error('remove project', err);
    return res.status(500).json({ success: false, message: 'Error al eliminar proyecto' });
  }
};