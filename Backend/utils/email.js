

export async function sendVerificationCode(email, code) {


  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: process.env.EMAILJS_SERVICE_ID,
      template_id: process.env.EMAILJS_TEMPLATE_ID,
      user_id: process.env.EMAILJS_PUBLIC_KEY,
      accessToken: process.env.EMAILJS_PRIVATE_KEY,
      template_params: {
        email: email,
        code: code,
        subject: 'Your PlayVerse verification code'
      }
    })
  })

  if(!response.ok){
    const error = await response.text()
    throw new Error(`EmailJS request failed (${response.status}): ${error}`)
  }
}