const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: 'HireLocal <onboarding@resend.dev>',
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error('Failed to send email:', error.message);
  }
};

module.exports = sendEmail;