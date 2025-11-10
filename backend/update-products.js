import mongoose from 'mongoose';
import Company from './models/Company.js';
import dotenv from 'dotenv';

dotenv.config();

const updateProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB');

    // Atualizar Pizzaria Italia
    await Company.findOneAndUpdate(
      { slug: 'pizzaria-italia' },
      {
        $set: {
          'products.$[].image': '/vite.svg' // Imagem temporária
        }
      }
    );

    // Atualizar Hamburgueria Artesanal
    await Company.findOneAndUpdate(
      { slug: 'hamburgueria-artesanal' },
      {
        $set: {
          'products.$[].image': '/vite.svg' // Imagem temporária
        }
      }
    );

    console.log('✅ Produtos atualizados com imagens temporárias');

    // Mostrar resultado
    const companies = await Company.find();
    companies.forEach(company => {
      console.log(`\n🏪 ${company.name}:`);
      company.products.forEach(product => {
        console.log(`   🍕 ${product.name} - R$ ${product.price} - ${product.image}`);
      });
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao atualizar produtos:', error);
    process.exit(1);
  }
};

updateProducts();
