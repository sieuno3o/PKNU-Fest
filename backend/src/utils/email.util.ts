import nodemailer from 'nodemailer'

// SMTP 설정
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// 이메일 발송 테스트
export const verifyEmailConnection = async () => {
  try {
    await transporter.verify()
    console.log('✅ Email server is ready')
    return true
  } catch (error) {
    console.error('❌ Email server error:', error)
    return false
  }
}

// 이메일 발송
export const sendEmail = async (options: {
  to: string
  subject: string
  html: string
  text?: string
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"PKNU-Fest" <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    })

    console.log('✅ Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ Email sending error:', error)
    throw error
  }
}

// 학생 인증 이메일 발송
export const sendStudentVerificationEmail = async (
  email: string,
  name: string,
  verificationCode: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .code { background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎓 PKNU-Fest 학생 인증</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${name}</strong>님!</p>
          <p>PKNU-Fest 학생 인증을 위한 인증 코드를 보내드립니다.</p>
          <p>아래 인증 코드를 앱에 입력해주세요:</p>

          <div class="code">${verificationCode}</div>

          <p>이 코드는 <strong>10분간</strong> 유효합니다.</p>
          <p>본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.</p>

          <div class="footer">
            <p>© 2025 PKNU-Fest. All rights reserved.</p>
            <p>부경대학교 축제 관리 시스템</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '[PKNU-Fest] 학생 인증 코드',
    html,
    text: `안녕하세요, ${name}님! PKNU-Fest 학생 인증 코드: ${verificationCode}. 이 코드는 10분간 유효합니다.`,
  })
}

// 예약 확인 이메일
export const sendReservationConfirmationEmail = async (
  email: string,
  name: string,
  eventTitle: string,
  qrCode: string
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .event-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .qr-code { text-align: center; padding: 20px; background: white; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 예약이 완료되었습니다!</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${name}</strong>님!</p>
          <p>다음 행사에 대한 예약이 성공적으로 완료되었습니다:</p>

          <div class="event-info">
            <h2 style="margin-top: 0;">${eventTitle}</h2>
            <p><strong>예약 번호:</strong> ${qrCode}</p>
          </div>

          <p>행사 당일 아래 QR 코드를 제시해주세요.</p>

          <div class="footer">
            <p>© 2025 PKNU-Fest. All rights reserved.</p>
            <p>문의사항이 있으시면 언제든지 연락주세요.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `[PKNU-Fest] ${eventTitle} 예약 확인`,
    html,
    text: `안녕하세요, ${name}님! ${eventTitle} 예약이 완료되었습니다. 예약 번호: ${qrCode}`,
  })
}

// 주문 완료 이메일
export const sendOrderConfirmationEmail = async (
  email: string,
  name: string,
  orderNumber: string,
  totalPrice: number
) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🍔 주문이 접수되었습니다!</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${name}</strong>님!</p>
          <p>주문이 성공적으로 접수되었습니다.</p>

          <div class="order-info">
            <h2 style="margin-top: 0;">주문 정보</h2>
            <p><strong>주문 번호:</strong> ${orderNumber}</p>
            <p><strong>결제 금액:</strong> ${totalPrice.toLocaleString()}원</p>
          </div>

          <p>주문이 준비되면 알림을 보내드리겠습니다.</p>

          <div class="footer">
            <p>© 2025 PKNU-Fest. All rights reserved.</p>
            <p>맛있게 즐겨주세요! 🎉</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: `[PKNU-Fest] 주문 확인 - ${orderNumber}`,
    html,
    text: `안녕하세요, ${name}님! 주문이 접수되었습니다. 주문 번호: ${orderNumber}, 결제 금액: ${totalPrice.toLocaleString()}원`,
  })
}

// 비밀번호 재설정 이메일
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string,
  frontendUrl: string = process.env.FRONTEND_URL || 'http://localhost:5173'
) => {
  const resetLink = `${frontendUrl}/reset-password/${resetToken}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔐 비밀번호 재설정</h1>
        </div>
        <div class="content">
          <p>안녕하세요, <strong>${name}</strong>님!</p>
          <p>PKNU-Fest 비밀번호 재설정을 요청하셨습니다.</p>
          <p>아래 버튼을 클릭하여 새 비밀번호를 설정해주세요:</p>

          <div style="text-align: center;">
            <a href="${resetLink}" class="button">비밀번호 재설정</a>
          </div>

          <div class="warning">
            ⚠️ 이 링크는 <strong>30분간</strong> 유효합니다.<br>
            본인이 요청하지 않았다면 이 이메일을 무시하셔도 됩니다.
          </div>

          <p style="font-size: 12px; color: #666;">
            버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣으세요:<br>
            <a href="${resetLink}">${resetLink}</a>
          </p>

          <div class="footer">
            <p>© 2025 PKNU-Fest. All rights reserved.</p>
            <p>부경대학교 축제 관리 시스템</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `

  return sendEmail({
    to: email,
    subject: '[PKNU-Fest] 비밀번호 재설정',
    html,
    text: `안녕하세요, ${name}님! 비밀번호 재설정 링크: ${resetLink} (30분간 유효)`,
  })
}
