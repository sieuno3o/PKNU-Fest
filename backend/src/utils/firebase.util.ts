import admin from 'firebase-admin'

// Firebase Admin 초기화
let firebaseApp: admin.app.App | null = null

export const initializeFirebase = () => {
  if (firebaseApp) {
    return firebaseApp
  }

  try {
    // 환경 변수에서 Firebase 설정 가져오기
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT

    if (!serviceAccount) {
      console.warn('⚠️  Firebase service account not configured. Push notifications will be disabled.')
      return null
    }

    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccount)),
    })

    console.log('✅ Firebase Admin initialized')
    return firebaseApp
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
    return null
  }
}

// 푸시 알림 발송
export const sendPushNotification = async (
  token: string,
  notification: {
    title: string
    body: string
    data?: Record<string, string>
  }
) => {
  try {
    if (!firebaseApp) {
      console.warn('Firebase not initialized. Skipping push notification.')
      return null
    }

    const message: admin.messaging.Message = {
      token,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    }

    const response = await admin.messaging().send(message)
    console.log('✅ Push notification sent:', response)
    return response
  } catch (error) {
    console.error('❌ Push notification error:', error)
    throw error
  }
}

// 여러 기기에 푸시 알림 발송
export const sendMulticastPushNotification = async (
  tokens: string[],
  notification: {
    title: string
    body: string
    data?: Record<string, string>
  }
) => {
  try {
    if (!firebaseApp) {
      console.warn('Firebase not initialized. Skipping push notification.')
      return null
    }

    const message: admin.messaging.MulticastMessage = {
      tokens,
      notification: {
        title: notification.title,
        body: notification.body,
      },
      data: notification.data,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          priority: 'high',
        },
      },
      apns: {
        headers: {
          'apns-priority': '10',
        },
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    }

    const response = await admin.messaging().sendEachForMulticast(message)
    console.log(`✅ Multicast notification sent: ${response.successCount} success, ${response.failureCount} failure`)
    return response
  } catch (error) {
    console.error('❌ Multicast push notification error:', error)
    throw error
  }
}

// 토픽 구독
export const subscribeToTopic = async (tokens: string[], topic: string) => {
  try {
    if (!firebaseApp) {
      console.warn('Firebase not initialized.')
      return null
    }

    const response = await admin.messaging().subscribeToTopic(tokens, topic)
    console.log(`✅ Subscribed to topic ${topic}:`, response)
    return response
  } catch (error) {
    console.error('❌ Topic subscription error:', error)
    throw error
  }
}

// 토픽 구독 해제
export const unsubscribeFromTopic = async (tokens: string[], topic: string) => {
  try {
    if (!firebaseApp) {
      console.warn('Firebase not initialized.')
      return null
    }

    const response = await admin.messaging().unsubscribeFromTopic(tokens, topic)
    console.log(`✅ Unsubscribed from topic ${topic}:`, response)
    return response
  } catch (error) {
    console.error('❌ Topic unsubscription error:', error)
    throw error
  }
}
