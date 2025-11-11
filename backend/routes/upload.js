import express from 'express';
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Configuração do multer
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG, GIF ou WebP.'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

// Rota de teste
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Upload route is working!'
  });
});

// Rota de upload - CORRIGIDA
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('📤 Recebendo requisição de upload...');

    if (!req.file) {
      console.log('❌ Nenhum arquivo recebido');
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem enviada'
      });
    }

    console.log('📁 Arquivo recebido:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // ✅ CORRIGIDO: Configuração simplificada do Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'flashmenu',
          resource_type: 'image',
          // ✅ REMOVIDO: format, quality, fetch_format problemáticos
          // O Cloudinary vai automaticamente otimizar a imagem
        },
        (error, result) => {
          if (error) {
            console.error('❌ Erro no Cloudinary:', error);
            reject(error);
          } else {
            console.log('✅ Upload Cloudinary bem-sucedido:', result.secure_url);
            resolve(result);
          }
        }
      );

      uploadStream.end(req.file.buffer);
    });

    res.json({
      success: true,
      imageUrl: result.secure_url
    });

  } catch (error) {
    console.error('❌ Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao fazer upload da imagem: ' + error.message
    });
  }
});

export default router;
