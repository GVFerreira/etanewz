import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Defina o método GET para servir os arquivos
export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const uploadsDirectory = path.join(process.cwd(), 'eta'); // Define o diretório de uploads
  const fullPath = path.join(uploadsDirectory, ...params.path); // Monta o caminho completo do arquivo

  try {
    if (fs.existsSync(fullPath)) {
      const fileExtension = path.extname(fullPath).toLowerCase(); // Obtém a extensão do arquivo

      // Verifica se o arquivo é um PDF
      if (fileExtension !== '.pdf') {
        return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
      }

      const fileBuffer = fs.readFileSync(fullPath); // Lê o arquivo

      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf', // Define o tipo de conteúdo como PDF
        },
      });
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
