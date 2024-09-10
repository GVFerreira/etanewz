import type { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File, Fields, Files } from 'formidable'
import { promises as fs } from 'fs'
import path from 'path'

// Desabilitar o bodyParser padrão do Next.js
export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), 'public/uploads')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const form = formidable({ 
      uploadDir, 
      keepExtensions: true,
      multiples: false 
    })

    // Certifique-se de que o diretório de upload existe
    await fs.mkdir(uploadDir, { recursive: true })

    form.parse(req, async (err, fields: Fields, files: Files) => {
      if (err) {
        res.status(500).json({ error: 'Erro ao processar o upload.' })
        return
      }

      // Capturando o primeiro arquivo enviado
      const file = Array.isArray(files.file) ? files.file[0] : files.file

      if (!file) {
        res.status(400).json({ error: 'Nenhum arquivo foi enviado.' })
        return
      }

      // Extraia o caminho da imagem carregada
      const filePath = file.filepath
      const imagePath = filePath.replace(process.cwd() + '/public', '')

      // Retornar sucesso com o caminho da imagem
      res.status(200).json({ message: 'Upload bem-sucedido!', valid: true, imagePath })
    })
  } catch (error) {
    console.error('Erro no upload:', error)
    res.status(500).json({ error: 'Ocorreu um erro ao fazer o upload da imagem.' })
  }
}

export default handler
