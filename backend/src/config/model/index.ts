import sequelize from '../database';
import User from './User';
import Sweet from './Sweet';

// Define associations if needed in the future
// User.hasMany(Sweet, { foreignKey: 'userId' });
// Sweet.belongsTo(User, { foreignKey: 'userId' });

const db = {
  sequelize,
  User,
  Sweet,
};

export default db;