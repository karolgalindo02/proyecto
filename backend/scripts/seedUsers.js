const db = require('../config/config');
const bcrypt = require('bcryptjs');

async function seedUsers() {
  console.log('🌱 Iniciando seed de usuarios...');
  
  try {
    // Hash de contraseñas
    const adminPassword = await bcrypt.hash('admin123', 10);
    const userPassword = await bcrypt.hash('user123', 10);

    // Limpiar usuarios existentes de prueba (opcional)
    const deleteQuery = `DELETE FROM users WHERE email IN ('admin@test.com', 'usuario1@test.com', 'usuario2@test.com')`;
    await new Promise((resolve, reject) => {
      db.query(deleteQuery, (err, result) => {
        if (err) {
          console.log('ℹ️  No se pudieron eliminar usuarios previos (puede que no existan)');
        }
        resolve();
      });
    });

    // Insertar usuarios de prueba
    const users = [
      {
        name: 'Admin',
        lastname: 'Sistema',
        email: 'admin@test.com',
        password: adminPassword,
        phone: '1234567890',
        image: null,
        role: 'admin'
      },
      {
        name: 'Juan',
        lastname: 'Pérez',
        email: 'usuario1@test.com',
        password: userPassword,
        phone: '1234567891',
        image: null,
        role: 'user'
      },
      {
        name: 'María',
        lastname: 'García',
        email: 'usuario2@test.com',
        password: userPassword,
        phone: '1234567892',
        image: null,
        role: 'user'
      }
    ];

    for (const user of users) {
      const insertQuery = `
        INSERT INTO users (name, lastname, email, password, phone, image, role, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;
      
      await new Promise((resolve, reject) => {
        db.query(insertQuery, [
          user.name,
          user.lastname,
          user.email,
          user.password,
          user.phone,
          user.image,
          user.role
        ], (err, result) => {
          if (err) {
            console.log(`❌ Error al crear usuario ${user.email}:`, err.message);
            reject(err);
          } else {
            console.log(`✅ Usuario ${user.email} creado con ID ${result.insertId}`);
            resolve(result);
          }
        });
      });
    }

    console.log('\n🎉 Usuarios de prueba creados exitosamente!');
    console.log('\n📋 Credenciales de acceso:');
    console.log('-----------------------------------');
    console.log('ADMIN:');
    console.log('  Email: admin@test.com');
    console.log('  Password: admin123');
    console.log('\nUSUARIO 1:');
    console.log('  Email: usuario1@test.com');
    console.log('  Password: user123');
    console.log('\nUSUARIO 2:');
    console.log('  Email: usuario2@test.com');
    console.log('  Password: user123');
    console.log('-----------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
}

seedUsers();
