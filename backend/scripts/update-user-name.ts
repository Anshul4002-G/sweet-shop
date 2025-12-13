#!/usr/bin/env ts-node
import * as dotenv from 'dotenv';
dotenv.config();

const args = process.argv.slice(2);
let emailArg = '';
let nameArg = '';

for (const arg of args) {
  if (arg.startsWith('--email=')) {
    emailArg = arg.split('=')[1];
  } else if (arg.startsWith('--name=')) {
    nameArg = arg.split('=')[1];
  }
}

if (!emailArg || !nameArg) {
  console.error('Usage: ts-node scripts/update-user-name.ts --email=user@example.com --name="New Name"');
  process.exit(1);
}

import { sequelize, User } from '../src/models';

const updateUserName = async (email: string, name: string) => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }

    user.name = name;
    await user.save();
    console.log(`User name updated to: ${name} for email: ${email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
};

updateUserName(emailArg, nameArg);