const nodemailer = require('nodemailer');

const enviarEmailNotificacao = async (destinatario, nomeLicenca, dataVencimento) => {
  try {
    // Configuração do transporte (exemplo: Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Ou outro provedor de e-mail
      auth: {
        user: 'seuemail@gmail.com', // Substitua pelo seu e-mail
        pass: 'suasenha',          // Substitua pela sua senha ou app password
      },
    });

    // Configuração do conteúdo do e-mail
    const mailOptions = {
      from: '"Sistema de Gestão" <seuemail@gmail.com>', // Remetente
      to: destinatario, // Destinatário (ex.: usuário administrador)
      subject: `Alerta: Licença "${nomeLicenca}" próxima ao vencimento!`,
      html: `
        <h1>Notificação de Vencimento de Licença</h1>
        <p>Prezado(a) Administrador,</p>
        <p>Esta é uma notificação automática informando que a licença <strong>"${nomeLicenca}"</strong> está próxima de seu vencimento.</p>
        <p><strong>Data de Vencimento:</strong> ${dataVencimento}</p>
        <p>Por favor, tome as medidas necessárias para renovar ou atualizar esta licença.</p>
        <hr />
        <p>Atenciosamente,</p>
        <p>Equipe de Gestão</p>
      `,
    };

    // Envio do e-mail
    const info = await transporter.sendMail(mailOptions);

    console.log('E-mail enviado com sucesso:', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
};

export default enviarEmailNotificacao;


// Exemplo de uso
const destinatario = 'admin@exemplo.com';
const nomeLicenca = 'Licença de Transporte XYZ';
const dataVencimento = '2025-01-15';

enviarEmailNotificacao(destinatario, nomeLicenca, dataVencimento);
