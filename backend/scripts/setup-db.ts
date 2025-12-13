import sequelize from '../src/config/database';
import { User, Sweet } from '../src/models';
import bcrypt from 'bcryptjs';

const setupDatabase = async (): Promise<void> => {
  try {
    console.log('🔧 Setting up database...');
    
    // Test connection
    await sequelize.authenticate();
    console.log('✅ Database connection established.');
    
    // Sync all models (force: true will drop existing tables)
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized.');
    
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      email: 'admin@sweetshop.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    });
    console.log('✅ Admin user created:', adminUser.email);
    
    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await User.create({
      email: 'user@sweetshop.com',
      password: userPassword,
      name: 'Regular User',
      role: 'user',
    });
    console.log('✅ Regular user created:', regularUser.email);
    
    // Create sample sweets
    const sweets = [
      {
        name: 'Chocolate Truffle',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50,
        description: 'Rich dark chocolate truffle with creamy center',
      },
      {
        name: 'Gummy Bears',
        category: 'Gummies',
        price: 1.99,
        quantity: 100,
        description: 'Assorted fruit flavored gummy bears',
      },
      {
        name: 'Caramel Candy',
        category: 'Caramels',
        price: 1.49,
        quantity: 75,
        description: 'Soft and chewy caramel candy',
      },
      {
        name: 'Lollipop',
        category: 'Lollipops',
        price: 0.99,
        quantity: 200,
        description: 'Fruit flavored lollipop on a stick',
      },
      {
        name: 'Hard Candy',
        category: 'Hard Candy',
        price: 0.79,
        quantity: 150,
        description: 'Assorted fruit flavored hard candies',
      },
      {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 3.49,
        quantity: 30,
        description: 'Premium milk chocolate bar',
      },
      {
        name: 'Sour Gummy Worms',
        category: 'Gummies',
        price: 2.49,
        quantity: 60,
        description: 'Tangy sour gummy worms',
      },
      {
        name: 'Toffee Candy',
        category: 'Caramels',
        price: 2.99,
        quantity: 40,
        description: 'Buttery toffee with almonds',
      },
    ];
    
    for (const sweetData of sweets) {
      const sweet = await Sweet.create(sweetData);
      console.log(`✅ Created sweet: ${sweet.name}`);
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('   👑 Admin: admin@sweetshop.com / admin123');
    console.log('   👤 User: user@sweetshop.com / user123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);

    // Provide actionable guidance for common failures
    // Authentication error -> likely Postgres not running or wrong credentials
    if (error && (error as any).parent && (error as any).parent.code === '28P01') {
      console.error('\nPossible cause: authentication failed for Postgres user.');
      console.error(' - Ensure Postgres is running and `DB_USER` / `DB_PASSWORD` are correct.');
      console.error(' - Quick option: run `npm run db:docker` to start a local Postgres instance (requires Docker).');
      console.error(' - After DB is available, re-run `npm run db:setup`.');
    }
    process.exit(1);
  }
};

setupDatabase();