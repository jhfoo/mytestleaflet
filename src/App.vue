<template>
  <v-app>
    <v-app-bar app color="primary" dark flat dense>
      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <v-icon>mdi-open-in-new</v-icon>
        <span class="ml-2">Leaflet Test</span>
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn v-on="on" href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">{{ UserName }}</span>
      </v-btn>

      <v-menu left bottom offset-y="">
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <template v-for="(item, index) in ProfileMenu">
            <v-divider v-if="item.type === 'divider'" :key="index"></v-divider>
            <v-list-item v-else @click="item.click" :key="index">
              <v-list-item-title>
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
const GlobalFirebase = require('./lib/GlobalFirebase.js')

export default {
  name: 'App',

  components: {
  },
  data() {
    return {
      ProfileMenu: [{
        click: () => this.$router.replace('/admin'),
        icon: 'mdi-account-outline',
        text: 'Account'
      }, {
        click: () => this.$router.replace('/admin'),
        icon: 'mdi-head-outline',
        text: 'Admin'
      }, {
        type: 'divider',
      }, {
        click: () => this.$router.replace('/about'),
        icon: 'mdi-information-outline',
        text: 'About'
      }, {
        click: () => this.onLogout(),
        icon: 'mdi-logout',
        text: 'Log Out'
      }]
    }
  },
  computed: {
    UserName() {
      let CurrentUser = GlobalFirebase.auth.currentUser
      if (CurrentUser === null) {
        return 'Guest'
      } else {
        let UserData = CurrentUser.providerData[0]
        if (UserData.displayName !== null) {
          return UserData.displayName
        } else {
          return UserData.email
        }
      }
    }
  },
  methods: {
    onLogout() {
      GlobalFirebase.auth.signOut()
      .then(() => {
        console.log('Sign off successful.')
        this.$router.replace('/')
      }).catch((err) => {
        console.error(err)
      })
    }
  }
};
</script>
