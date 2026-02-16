/**
 * Firebase (Google) integration for analytics and future services.
 * Set VITE_FIREBASE_* env vars to enable; app works without them.
 * @see https://firebase.google.com/docs/web/setup
 */

import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported } from 'firebase/analytics'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

/** @type {import('firebase/app').FirebaseApp | null} */
let app = null
/** @type {import('firebase/analytics').Analytics | null} */
let analytics = null

if (config.apiKey && config.projectId) {
  try {
    app = initializeApp(config)
    if (import.meta.env.PROD) {
      isSupported().then(yes => {
        if (yes) analytics = getAnalytics(app)
      })
    }
  } catch (e) {
    console.warn('Firebase init skipped:', e.message)
  }
}

export { app, analytics }
