import mongoose from 'mongoose';
import Company from './models/Company.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleCompanies = [
  {
    slug: 'pizzaria-italia',
    name: 'Pizzaria Italia',
    description: 'As melhores pizzas da cidade, feitas com ingredientes frescos e massa artesanal.',
    logo: '/vite.svg',
    category: 'Pizzaria',
    phone: '11999999999',
    deliveryFee: 5.00,
    minOrderValue: 25.00,
    products: [
      {
        name: 'Pizza Margherita',
        description: 'Molho de tomate italiano, mussarela de búfala fresca e manjericão',
        price: 45.90,
        image: '/vite.svg',
        category: 'Pizzas Tradicionais'
      },
      {
        name: 'Pizza Calabresa',
        description: 'Calabresa artesanal fatiada, cebola roxa e azeitonas',
        price: 49.90,
        image: '/vite.svg',
        category: 'Pizzas Tradicionais'
      },
      {
        name: 'Pizza Quatro Queijos',
        description: 'Mussarela, provolone, parmesão e gorgonzola',
        price: 52.90,
        image: '/vite.svg',
        category: 'Pizzas Especiais'
      },
      // 🥤 BEBIDAS
      {
        name: 'Coca-Cola 2L',
        description: 'Refrigerante Coca-Cola gelado',
        price: 12.00,
        image: '/vite.svg',
        category: 'Bebidas'
      },
      {
        name: 'Suco de Laranja Natural',
        description: 'Suco de laranja fresco espremido na hora',
        price: 8.50,
        image: '/vite.svg',
        category: 'Bebidas'
      }
    ]
  },
  {
    slug: 'hamburgueria-artesanal',
    name: 'Hamburgueria Artesanal',
    description: 'Hambúrgueres gourmet preparados na hora com blends especiais de carne.',
    logo: '/vite.svg',
    category: 'Hamburgueria',
    phone: '11988888888',
    deliveryFee: 7.00,
    minOrderValue: 30.00,
    products: [
      {
        name: 'Classic Burger',
        description: 'Pão brioche, blend 180g, queijo cheddar, alface e tomate',
        price: 28.90,
        image: '/vite.svg',
        category: 'Burgers'
      },
      {
        name: 'Bacon Crazy',
        description: 'Blend 180g, queijo cheddar, bacon crocante, cebola caramelizada',
        price: 32.90,
        image: '/vite.svg',
        category: 'Burgers Especiais'
      },
      {
        name: 'Batata Rústica',
        description: 'Porção de batata rústica temperada com ervas',
        price: 15.90,
        image: '/vite.svg',
        category: 'Acompanhamentos'
      },
      // 🥤 BEBIDAS
      {
        name: 'Refrigerante Lata',
        description: 'Coca-Cola, Guaraná ou Fanta Laranja',
        price: 6.00,
        image: '/vite.svg',
        category: 'Bebidas'
      },
      {
        name: 'Milkshake Chocolate',
        description: 'Milkshake cremoso de chocolate',
        price: 14.90,
        image: '/vite.svg',
        category: 'Bebidas'
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Limpar coleção existente
    await Company.deleteMany({});
    console.log('✅ Coleção limpa');

    // Inserir empresas
    await Company.insertMany(sampleCompanies);
    console.log('✅ Dados de exemplo inseridos');

    console.log('🎉 Banco populado com sucesso!');

    // Mostrar o que foi inserido
    const companies = await Company.find();
    console.log(`📊 Total de empresas: ${companies.length}`);

    companies.forEach(company => {
      console.log(`\n🏪 ${company.name}:`);
      company.products.forEach(product => {
        console.log(`   ${product.category === 'Bebidas' ? '🥤' : '🍕'} ${product.name} - ${product.category}`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
    process.exit(1);
  }
};

seedDatabase();
