import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendNotification = async (to: string, siteName: string, data: any) => {
  const body = `
    <h1>Novo contato em ${siteName}</h1>
    <p>Você recebeu uma nova mensagem:</p>
    <ul>
      ${Object.entries(data).map(([key, value]) => `<li><strong>${key}:</strong> ${JSON.stringify(value)}</li>`).join('')}
    </ul>
  `;

  return await resend.emails.send({
    from: 'Contact <onboarding@resend.dev>',
    to,
    subject: `Novo Contato - ${siteName}`,
    html: body,
  });
};
