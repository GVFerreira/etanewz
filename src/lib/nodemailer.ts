import nodemailer from 'nodemailer'
import handlebars from 'nodemailer-express-handlebars'
import path from 'path'

// Configurar o transporte de e-mail
const transporter = nodemailer.createTransport({
  host: "mail.etacanadense.com.br",
  port: 587, 
  secure: false, 
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS,
  }
})

// Configuração do handlebars para templates
transporter.use(
  'compile',
  handlebars({
    viewEngine: {
      extname: '.hbs', // Extensão dos arquivos de template
      layoutsDir: path.resolve('./templates/'), // Pasta de layouts (se houver)
      defaultLayout: false, // Desativar layout padrão se não estiver usando
      partialsDir: path.resolve('./templates/'), // Pasta de partials
    },
    viewPath: path.resolve('./templates/'), // Caminho para os templates
    extName: '.hbs', // Extensão do arquivo de template
  })
)

export default transporter
