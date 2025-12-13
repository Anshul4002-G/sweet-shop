import sequelize from '../config/database';
import User from '../config/model/User';
import Sweet from '../config/model/Sweet';

// Setup associations
User.hasMany(Sweet, { foreignKey: 'createdBy' });
Sweet.belongsTo(User, { foreignKey: 'createdBy' });

export { sequelize, User, Sweet };