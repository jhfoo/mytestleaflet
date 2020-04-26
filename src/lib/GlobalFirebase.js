// ref: https://savvyapps.com/blog/definitive-guide-building-web-app-vuejs-firebase
// ref: https://stackoverflow.com/questions/37369929/disable-accountchooser-for-firebase-auth/42400245
import firebase from 'firebase'

const AppInitConfig = {
  apiKey: "AIzaSyAJ_bAN4DgrkwJTwanCp_l5gFTOVJ1Ivkw",
  authDomain: "kungfoo-d90fe.firebaseapp.com",
  databaseURL: "https://kungfoo-d90fe.firebaseio.com",
  projectId: "kungfoo-d90fe",
  storageBucket: "kungfoo-d90fe.appspot.com",
  messagingSenderId: "1077044227468",
  appId: "1:1077044227468:web:0297f789c5f2f7124dfaa9",
  measurementId: "G-MYSSNM8EGZ"
}

const SignInConfig = [
  // Leave the lines as is for the providers you want to offer your users.
  firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  firebase.auth.FacebookAuthProvider.PROVIDER_ID,
  // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
  firebase.auth.GithubAuthProvider.PROVIDER_ID,
  firebase.auth.EmailAuthProvider.PROVIDER_ID,
  // firebase.auth.PhoneAuthProvider.PROVIDER_ID,
  // firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
]

firebase.initializeApp(AppInitConfig)

const db = firebase.firestore(),
  auth = firebase.auth()

export {
  db,
  auth,
  SignInConfig
}
