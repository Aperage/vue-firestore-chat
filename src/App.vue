<template>
<v-app id="app">
  <v-toolbar app class="indigo white--text">
    <div class="title">Vue and Cloud Firestore Chat Application</div>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn flat class="white--text" v-show="signOutButton" @click="signOut">Sign out</v-btn>
    </v-toolbar-items>
  </v-toolbar>
  <main>
    <v-content>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-content>
  </main>
</v-app>
</template>

<script>
import * as firebase from './firebase/config'
export default {
  name: 'app',
  data() {
    return {
      signOutButton: false
    }
  },
  created: function() {
    const self = this;
    firebase.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.signOutButton = true;
      } else {
        self.signOutButton = false;
      }
    });
  },
  methods: {
    signOut: function() {
      const self = this;
      firebase.app.auth().signOut().then(function() {
        self.$router.push('/');
      }).catch(function(error) {
        console.log(error);
      });
    }
  }
}
</script>