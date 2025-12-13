import * as dotenv from 'dotenv';
// Ensure we use the test DB (sqlite in-memory)
dotenv.config();
process.env.NODE_ENV = 'test';

// Import startServer and models dynamically
const { startServer } = require('../src/index');
const { sequelize, User } = require('../src/models');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'chaubeyr1234@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin User';

const ensureAdmin = async () => {
  try {
    // Make sure DB is ready (startServer already syncs, but ensure connection)
    await sequelize.authenticate();

    const [user, created] = await User.findOrCreate({
      where: { email: ADMIN_EMAIL },
      defaults: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD, name: ADMIN_NAME, role: 'admin' },
    });

    if (!created && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log(`User promoted to admin: ${ADMIN_EMAIL}`);
    } else if (created) {
      console.log(`User created and promoted to admin: ${ADMIN_EMAIL}`);
    } else {
      console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('Failed to ensure admin user exists:', err);
  }
};

startServer()
  .then(async () => {
    await ensureAdmin();
  })
  .catch((err: any) => {
    console.error('Failed to start server with sqlite:', err);
    process.exit(1);
  });
