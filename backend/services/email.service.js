const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const sendResetPasswordEmail = async (email, prenom, resetLink) => {
  await transporter.sendMail({
    from: `"LeCycleLyonnais" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Réinitialisation de votre mot de passe',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #030229;">Bonjour ${prenom},</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valable <strong>1 heure</strong>.</p>
        <a href="${resetLink}" style="display:inline-block; margin: 20px 0; padding: 12px 24px; background-color: #48CAE4; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Réinitialiser mon mot de passe
        </a>
        <p style="color: #9797A7; font-size: 14px;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `,
  })
}

module.exports = { sendResetPasswordEmail }
