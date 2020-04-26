<template>
  <div>
      <v-container>
        <v-row>
          <v-col md="8">
            <div id="firebaseui-auth-container"></div>
          </v-col>
          <v-col md="4">
            <div v-if="isAuthenticated">
              <v-btn @click="$router.replace('/showmap')">Continue to map</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
  </div>
</template>

<style scoped>
</style>

<script>
import * as firebaseui from 'firebaseui'
const GlobalFirebase = require('../lib/GlobalFirebase.js')

  export default {
    name: 'Home',
    components: {
    },
    data: () => ({
      uiConfig: {
        signInSuccessUrl: '/#/showmap',
        signInOptions: GlobalFirebase.SignInConfig,
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
        tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        privacyPolicyUrl: function() {
          window.location.assign('<your-privacy-policy-url>')
        },
        credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      }
    }),
    mounted() {
      // Initialize the FirebaseUI Widget using Firebase.
      // GlobalFirebase.auth.onAuthStateChanged((user) => {
      //   console.log(GlobalFirebase.auth.currentUser)
      //   console.log(user)
      //   if (user) {
      //     console.log('Retrieving roles')
      //     GlobalFirebase.db.collection('roles').get().then((records) => {
      //       console.log('Records')
      //       records.forEach((record) => {
      //         console.log('Record %s', record.id)
      //         console.log(record.data())
      //       })
      //     })
      //   }
      // })
      if (GlobalFirebase.auth.currentUser !== null) {
        console.log(GlobalFirebase.auth.currentUser.providerData)
      }
      let ui = new firebaseui.auth.AuthUI(GlobalFirebase.auth)
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', this.uiConfig)
    },
    computed: {
      isAuthenticated() {
        return GlobalFirebase.auth.currentUser !== null
      }
    },
    methods: {
    }
  }
</script>
