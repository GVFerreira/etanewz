import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Defina o método GET para servir os arquivos
export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const uploadsDirectory = path.join(process.cwd(), 'uploads'); // Define o diretório de uploads
  const fullPath = path.join(uploadsDirectory, ...params.path); // Monta o caminho completo do arquivo

  try {
    if (fs.existsSync(fullPath)) {
      const fileBuffer = fs.readFileSync(fullPath); // Lê o arquivo
      const fileExtension = path.extname(fullPath).toLowerCase(); // Obtém a extensão do arquivo

      let contentType = 'application/octet-stream'; // Tipo de conteúdo padrão
      if (fileExtension === '.png') contentType = 'image/png';
      else if (fileExtension === '.jpg' || fileExtension === '.jpeg') contentType = 'image/jpeg';
      else if (fileExtension === '.gif') contentType = 'image/gif';

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': contentType,
        },
      });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
