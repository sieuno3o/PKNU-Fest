import axios from 'axios'

const TOSS_API_URL = 'https://api.tosspayments.com/v1'
const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || ''

// Toss Payments API 클라이언트
const tossApi = axios.create({
  baseURL: TOSS_API_URL,
  headers: {
    Authorization: `Basic ${Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64')}`,
    'Content-Type': 'application/json',
  },
})

// 결제 승인
export const confirmPayment = async (data: {
  paymentKey: string
  orderId: string
  amount: number
}) => {
  try {
    const response = await tossApi.post('/payments/confirm', {
      paymentKey: data.paymentKey,
      orderId: data.orderId,
      amount: data.amount,
    })

    console.log('✅ Payment confirmed:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Payment confirmation error:', error.response?.data || error.message)
    throw error
  }
}

// 결제 조회
export const getPayment = async (paymentKey: string) => {
  try {
    const response = await tossApi.get(`/payments/${paymentKey}`)
    return response.data
  } catch (error: any) {
    console.error('❌ Payment retrieval error:', error.response?.data || error.message)
    throw error
  }
}

// 결제 취소
export const cancelPayment = async (
  paymentKey: string,
  data: {
    cancelReason: string
    cancelAmount?: number
    refundReceiveAccount?: {
      bank: string
      accountNumber: string
      holderName: string
    }
  }
) => {
  try {
    const response = await tossApi.post(`/payments/${paymentKey}/cancel`, data)

    console.log('✅ Payment cancelled:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Payment cancellation error:', error.response?.data || error.message)
    throw error
  }
}

// 가상계좌 발급
export const issueVirtualAccount = async (data: {
  orderId: string
  orderName: string
  amount: number
  customerName: string
  validHours?: number
}) => {
  try {
    const response = await tossApi.post('/virtual-accounts', {
      orderId: data.orderId,
      orderName: data.orderName,
      amount: data.amount,
      customerName: data.customerName,
      validHours: data.validHours || 24,
    })

    console.log('✅ Virtual account issued:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Virtual account issuance error:', error.response?.data || error.message)
    throw error
  }
}

// 카드 자동결제 (빌링) - 빌링키 발급
export const issueBillingKey = async (data: {
  customerKey: string
  authKey: string
}) => {
  try {
    const response = await tossApi.post('/billing/authorizations/card', data)

    console.log('✅ Billing key issued:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Billing key issuance error:', error.response?.data || error.message)
    throw error
  }
}

// 빌링키로 결제
export const payWithBillingKey = async (data: {
  billingKey: string
  customerKey: string
  amount: number
  orderId: string
  orderName: string
}) => {
  try {
    const response = await tossApi.post(`/billing/${data.billingKey}`, {
      customerKey: data.customerKey,
      amount: data.amount,
      orderId: data.orderId,
      orderName: data.orderName,
    })

    console.log('✅ Billing payment successful:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Billing payment error:', error.response?.data || error.message)
    throw error
  }
}

// 결제 상태 체크
export const checkPaymentStatus = (status: string): {
  isPaid: boolean
  isCancelled: boolean
  isWaiting: boolean
} => {
  return {
    isPaid: status === 'DONE',
    isCancelled: status === 'CANCELED',
    isWaiting: status === 'WAITING_FOR_DEPOSIT' || status === 'IN_PROGRESS',
  }
}

// 결제 금액 검증
export const validatePaymentAmount = (
  requestedAmount: number,
  actualAmount: number
): boolean => {
  return requestedAmount === actualAmount
}
