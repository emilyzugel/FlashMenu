import express from 'express';
import Company from '../models/Company.js';

const router = express.Router();

// GET /api/companies - Lista todas empresas ativas
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find({ active: true })
      .select('slug name description logo category')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: companies,
      count: companies.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresas',
      error: error.message
    });
  }
});

// GET /api/companies/:slug - Busca empresa por slug
router.get('/:slug', async (req, res) => {
  try {
    const company = await Company.findOne({
      slug: req.params.slug,
      active: true
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar empresa',
      error: error.message
    });
  }
});

// POST /api/companies - Criar nova empresa
router.post('/', async (req, res) => {
  try {
    const company = new Company(req.body);
    const savedCompany = await company.save();

    res.status(201).json({
      success: true,
      message: 'Empresa criada com sucesso',
      data: savedCompany
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Slug já existe'
      });
    }

    res.status(400).json({
      success: false,
      message: 'Erro ao criar empresa',
      error: error.message
    });
  }
});

// PUT /api/companies/:slug/logo - Atualizar logo da empresa
router.put('/:slug/logo', async (req, res) => {
  try {
    const { logo } = req.body;

    if (!logo) {
      return res.status(400).json({
        success: false,
        message: 'URL da logo é obrigatória'
      });
    }

    const company = await Company.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { logo } },
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Logo atualizada com sucesso',
      data: company
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar logo',
      error: error.message
    });
  }
});

// DELETE /api/companies/:slug - Desativar empresa
router.delete('/:slug', async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { active: false } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Empresa desativada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao desativar empresa',
      error: error.message
    });
  }
});

// POST /api/companies/:slug/products - Adicionar produto
router.post('/:slug/products', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    company.products.push(req.body);
    const savedCompany = await company.save();

    const newProduct = savedCompany.products[savedCompany.products.length - 1];

    res.status(201).json({
      success: true,
      message: 'Produto adicionado com sucesso',
      data: newProduct
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao adicionar produto',
      error: error.message
    });
  }
});

// PUT /api/companies/:slug/products/:productId - Atualizar produto
router.put('/:slug/products/:productId', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    const product = company.products.id(req.params.productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produto não encontrado'
      });
    }

    Object.assign(product, req.body);
    const savedCompany = await company.save();

    res.json({
      success: true,
      message: 'Produto atualizado com sucesso',
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Erro ao atualizar produto',
      error: error.message
    });
  }
});

// DELETE /api/companies/:slug/products/:productId - Remover produto
router.delete('/:slug/products/:productId', async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa não encontrada'
      });
    }

    company.products.pull(req.params.productId);
    await company.save();

    res.json({
      success: true,
      message: 'Produto removido com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao remover produto',
      error: error.message
    });
  }
});

export default router;
