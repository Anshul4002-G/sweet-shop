import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { Sweet } from '../models';
import { AuthRequest } from '../middleware/auth';

// Create a new sweet (Admin only)
export const createSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, category, price, quantity, description } = req.body;

    // Validate input
    if (!name || !category || !price || quantity === undefined) {
      res.status(400).json({ error: 'Name, category, price, and quantity are required' });
      return;
    }

    // Create new sweet
    const sweet = await Sweet.create({
      name,
      category,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      description,
    });

    res.status(201).json({
      success: true,
      message: 'Sweet created successfully',
      sweet,
    });
  } catch (error) {
    console.error('Create sweet error:', error);
    
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all sweets
export const getAllSweets = async (req: Request, res: Response): Promise<void> => {
  try {
    const sweets = await Sweet.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: sweets.length,
      sweets,
    });
  } catch (error) {
    console.error('Get all sweets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single sweet by ID
export const getSweetById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const sweet = await Sweet.findByPk(id);

    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    res.json({
      success: true,
      sweet,
    });
  } catch (error) {
    console.error('Get sweet by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search sweets
export const searchSweets = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const where: any = {};

    // Search by name (case-insensitive partial match)
    if (name) {
      // Use case-insensitive search; SQLite doesn't support ILIKE, so fall back to LIKE for tests
      const dialect = (Sweet.sequelize && Sweet.sequelize.getDialect && Sweet.sequelize.getDialect()) || '';
      if (dialect === 'sqlite') {
        where.name = { [Op.like]: `%${name}%` };
      } else {
        where.name = { [Op.iLike]: `%${name}%` };
      }
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) {
        where.price[Op.gte] = parseFloat(minPrice as string);
      }
      if (maxPrice) {
        where.price[Op.lte] = parseFloat(maxPrice as string);
      }
    }

    const sweets = await Sweet.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      count: sweets.length,
      sweets,
    });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update sweet (Admin only)
export const updateSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find sweet
    const sweet = await Sweet.findByPk(id);
    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    // Update sweet
    await sweet.update(updates);

    res.json({
      success: true,
      message: 'Sweet updated successfully',
      sweet,
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    
    if (error instanceof Error && error.name === 'SequelizeValidationError') {
      res.status(400).json({ error: 'Validation error', details: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete sweet (Admin only)
export const deleteSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Find sweet
    const sweet = await Sweet.findByPk(id);
    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    // Delete sweet
    await sweet.destroy();

    res.json({
      success: true,
      message: 'Sweet deleted successfully',
    });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Purchase sweet
export const purchaseSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity = 1 } = req.body;

    // Validate quantity
    const purchaseQuantity = parseInt(quantity);
    if (purchaseQuantity <= 0) {
      res.status(400).json({ error: 'Purchase quantity must be greater than 0' });
      return;
    }

    // Find sweet
    const sweet = await Sweet.findByPk(id);
    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    // Check stock
    if (sweet.quantity < purchaseQuantity) {
      res.status(400).json({ error: 'Insufficient stock' });
      return;
    }

    // Update quantity
    sweet.quantity -= purchaseQuantity;
    await sweet.save();

    res.json({
      success: true,
      message: 'Purchase successful',
      sweet,
      purchasedQuantity: purchaseQuantity,
    });
  } catch (error) {
    console.error('Purchase sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Restock sweet (Admin only)
export const restockSweet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { quantity = 10 } = req.body;

    // Validate quantity
    const restockQuantity = parseInt(quantity);
    if (restockQuantity <= 0) {
      res.status(400).json({ error: 'Restock quantity must be greater than 0' });
      return;
    }

    // Find sweet
    const sweet = await Sweet.findByPk(id);
    if (!sweet) {
      res.status(404).json({ error: 'Sweet not found' });
      return;
    }

    // Update quantity
    sweet.quantity += restockQuantity;
    await sweet.save();

    res.json({
      success: true,
      message: 'Restock successful',
      sweet,
      restockedQuantity: restockQuantity,
    });
  } catch (error) {
    console.error('Restock sweet error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};