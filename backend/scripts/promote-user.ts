#!/usr/bin/env ts-node
import * as dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);
let emailArg = '';
for (const arg of args) {
  if (arg.startsWith('--email=')) {
    emailArg = arg.split('=')[1];
  }
}
if (!emailArg && args.length > 0) {
  emailArg = args[0];
}

if (!emailArg) {
  console.error('Usage: ts-node scripts/promote-user.ts --email=user@example.com');
  process.exit(1);
}

import { sequelize, User } from '../src/models';
import * as bcrypt from 'bcryptjs';

const promote = async (email: string) => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Ensure tables exist (useful for sqlite test env)
    await sequelize.sync();

    // Find or create the user; if created, set a default password and show it
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        email,
        name: email.split('@')[0] || 'Promoted User',
        password: await bcrypt.hash('admin123', 10),
        role: 'user',
      },
    });

    if (created) {
      console.log(`User did not exist and was created with password 'admin123'`);
    }

    user.role = 'admin';
    await user.save();
    console.log(`User promoted to admin: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('Failed to promote user:', err);
    process.exit(1);
  }
};

promote(emailArg);
