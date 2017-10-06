<template>
<div class="login-form">
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-title primary-title>
          <div class="headline grey--text text--darken-2">
            {{cardTitle}}
          </div>
        </v-card-title>
        <v-card-text>
          <div v-show="loginForm">
            <v-text-field label="Email" prepend-icon="email" v-model="loginData.email"></v-text-field>
            <v-text-field label="Password" type="password" prepend-icon="vpn_key" v-model="loginData.password"></v-text-field>
            <p class="text-xs-center">Don't have an account? <a @click="showForm('register')" class="links">Register</a>.</p>
          </div>
          <div v-show="registerForm">
            <v-text-field label="Full Name" prepend-icon="person" v-model="registerData.fullName"></v-text-field>
            <v-text-field label="Profile Picture URL" prepend-icon="insert_photo" v-model="registerData.imgUrl"></v-text-field>
            <v-text-field label="Email" prepend-icon="email" v-model="registerData.email"></v-text-field>
            <v-text-field label="Password" type="password" prepend-icon="vpn_key" v-model="registerData.password"></v-text-field>
            <p class="text-xs-center">Already have an account? <a @click="showForm('login')" class="links">Login</a>.</p>       
          </div>
          <div class="text-xs-center" v-show="loader">
              <v-progress-circular indeterminate v-bind:size="100" class="indigo--text text--darken-1"></v-progress-circular>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn v-if="cardTitle === 'Login'" flat class="indigo--text" @click="login">Submit <v-icon right>send</v-icon></v-btn>
          <v-btn v-else-if="cardTitle === 'Create an account'" flat class="indigo--text" @click="register">Submit <v-icon right>send</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <!-- Snackbar -->
  <v-snackbar
    :timeout="2500" bottom left v-model="snackbar">
    {{ snackbarMessage }}
    <v-btn flat class="pink--text" @click.native="snackbar = false">Close</v-btn>
  </v-snackbar>
  <!-- Snackbar -->
</div>
</template>

<script>
import * as firebase from '../firebase/config'
let users = firebase.usersCollection;
export default {
  name: 'login',
  data () {
    return {
      cardTitle: null,
      loginForm: false,
      registerForm: false,
      loader: false,
      registerData: {
        fullName: null,
        email: null,
        password: null,
        imgUrl: null,
        uid: null
      },
      loginData: {
        email: null,
        password: null
      },
      snackbar: false,
      snackbarMessage: null
    }
  },
  created: function() {
    this.cardTitle = 'Login';
    this.loginForm = true;
    const self = this;
    firebase.app.auth().onAuthStateChanged(function(user) {
      if (user) {
        self.$router.push('/chatroom')
      }
    });
  },
  methods: {
    showForm: function(form) {
      if(form === 'login') {
        this.loginForm = true;
        this.registerForm = false;
        this.cardTitle = 'Login';
      } else {
        this.loginForm = false;
        this.registerForm = true;
        this.cardTitle = 'Create an account';
      }
    },
    register: function() {
      const self = this;
      if(!this.registerData.fullName || !this.registerData.email || !this.registerData.password || !this.registerData.imgUrl) {
        this.popup('All fields are required.');
        return false;
      } else {
        this.loader = true;
        this.registerForm = false;
        firebase.app.auth()
        .createUserWithEmailAndPassword(this.registerData.email, this.registerData.password)
        .then(function(success) {
          var uid = success.uid;
          self.registerData.uid = uid;
          users.add(self.registerData).then(function() {
            self.popup('Success! You may now login.');
            self.registerForm = false;
            self.loginForm = true;
            self.cardTitle = 'Login';
            self.loader = false;
            self.registerForm = false;
          }); // add to users collection
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
          self.popup(error.message);
          self.loader = false;
          self.registerForm = true;
        });
      }
    },
    login: function() {
      const self = this;
      if(!this.loginData.email || !this.loginData.password) {
        this.popup('All fields are required.');
        return false;
      } else {
        this.loader = true;
        this.loginForm = false;
        firebase.app.auth()
        .signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
        .then(function(success) {
          self.loader = false;
          self.loginForm = true;
          self.$router.push('/chatroom');
        })
        .catch(function(error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode)
          console.log(errorMessage)
          if(errorCode === 'auth/user-not-found') {
            self.popup('User not found.')
          } else {
            self.popup(error.message);
          }
          self.loginData.password = null;
          self.loader = false;
          self.loginForm = true;
        });
      }
    },
    popup: function(message) {
      this.snackbarMessage = message;
      this.snackbar = true;
    }
  }
}
</script>

<style scoped>
  .login-form {
    margin-top: 10px;
  }

  .links {
    cursor: pointer;
    text-decoration: none;
  }
</style>