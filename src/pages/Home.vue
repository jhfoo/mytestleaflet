<template>
  <div>
    <div id="firebaseui-auth-container"></div>
  </div>
</template>

<style scoped>
</style>

<script>
import * as firebaseui from 'firebaseui'
import firebase from 'firebase'

  export default {
    name: 'Home',
    components: {
    },
    data: () => ({
      uiConfig: {
        signInSuccessUrl: '/#/showmap',
        signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.GithubAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>')
        }
      }
    }),
    mounted() {
      // Initialize the FirebaseUI Widget using Firebase.
      firebase.initializeApp({
        apiKey: "AIzaSyAJ_bAN4DgrkwJTwanCp_l5gFTOVJ1Ivkw",
        authDomain: "kungfoo-d90fe.firebaseapp.com",
        databaseURL: "https://kungfoo-d90fe.firebaseio.com",
        projectId: "kungfoo-d90fe",
        storageBucket: "kungfoo-d90fe.appspot.com",
        messagingSenderId: "1077044227468",
        appId: "1:1077044227468:web:0297f789c5f2f7124dfaa9",
        measurementId: "G-MYSSNM8EGZ"
      })
      firebase.auth().onAuthStateChanged((user) => {
        console.log(user)
        if (user) {
          console.log('Retrieving roles')
          firebase.firestore().collection('roles').get().then((records) => {
            console.log('Records')
            records.forEach((record) => {
              console.log('Record %s', record.id)
              console.log(record.data())
            })
          })
        }
      })
      let ui = new firebaseui.auth.AuthUI(firebase.auth())
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', this.uiConfig)   },
    methods: {
    }
  }
</script>
