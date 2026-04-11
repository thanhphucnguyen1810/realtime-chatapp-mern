import SibApiV3Sdk from 'sib-api-v3-sdk'
import { env } from '~/config/environment'

const client = SibApiV3Sdk.ApiClient.instance
const apiKey = client.authentications['api-key']
apiKey.apiKey = env.BREVO_API_KEY

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()

const sendEmail = async (recipientEmail, subject, htmlContent) => {
  try {
    const result = await apiInstance.sendTransacEmail({
      sender: {
        email: env.ADMIN_EMAIL_ADDRESS,
        name: env.ADMIN_EMAIL_NAME
      },
      to: [{ email: recipientEmail }],
      subject: subject,
      htmlContent: htmlContent
    })

    return result
  } catch (error) {
    console.error('EMAIL ERROR:', error.response?.body || error.message || error)
    throw error
  }
}

export const BrevoProvider = { sendEmail }
