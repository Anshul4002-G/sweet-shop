import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database';

interface SweetAttributes {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SweetCreationAttributes extends Optional<SweetAttributes, 'id'> {}

class Sweet extends Model<SweetAttributes, SweetCreationAttributes> implements SweetAttributes {
  public id!: number;
  public name!: string;
  public category!: string;
  public price!: number;
  public quantity!: number;
  public description?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check if in stock
  public isInStock(): boolean {
    return this.quantity > 0;
  }

  // Instance method to purchase
  public purchase(quantity: number = 1): void {
    if (quantity > this.quantity) {
      throw new Error('Insufficient stock');
    }
    this.quantity -= quantity;
  }

  // Instance method to restock
  public restock(quantity: number = 10): void {
    this.quantity += quantity;
  }
}

Sweet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 255],
      },
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true,
        min: 0,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isInt: true,
        min: 0,
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Sweet',
    tableName: 'sweets',
    timestamps: true,
  }
);

export default Sweet;