<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <div class="headline">
          Chat Room
        </div>
      </v-card-title>
      <v-card-text>
          <v-progress-linear v-bind:indeterminate="true" v-show="loader"></v-progress-linear>
        <div id="chat-container">
          <v-list two-line>
            <transition-group name="fade">
            <v-list-tile @dblclick.stop="like(m.messageId)" ripple avatar @click="" v-for="(m, i) in orderBy(messages, 'created_at')" :key="i">
              <v-list-tile-avatar>
                <img :src="m.imageUrl"/>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-html="m.fullName"></v-list-tile-title>
                <v-list-tile-sub-title v-html="m.text"></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-list-tile-action-text>
                    {{ m.created_at | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
                </v-list-tile-action-text>
                <div v-if="m.likes.length > 0">
                  <v-badge left >
                    <span slot="badge">{{ m.likes.length }}</span>
                    <v-icon class="red--text text--lighten-1">favorite</v-icon>
                  </v-badge>
                </div>
                <div v-else>
                  <v-icon class="grey--text text--lighten-1">favorite_border</v-icon>
                </div>
              </v-list-tile-action>
            </v-list-tile>
          </transition-group>
          </v-list>
        </div>
        <v-text-field 
        maxlength="60"
        counter="60"
        :disabled="chatDisable"
        hint="press enter after typing" 
        @keyup.enter="send"
        label="type your message here..." 
        append-icon="send" 
        v-model="chat.text"
        :append-icon-cb="send"
        :change="typing === true"
        ></v-text-field>
        <p v-show="typing">Someone is typing...</p>
      </v-card-text>
    </v-card>
    <!-- snackbar -->
    <v-snackbar :timeout="2500" bottom left v-model="snackbar">
      {{ snackbarMsg }}
      <v-btn flat class="pink--text" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
    <!-- snackbar -->
  </div>
</template>

  
<script>
import * as firebase from '../firebase/config'
// collections
let users = firebase.usersCollection;
let messages = firebase.messagesCollection;
let typingStatus = firebase.typingStatus;
let likes = firebase.likesCollection;
  export default {
    name: 'chatroom',
    data () {
      return {
        messages: [],
        chat: {
          text: null,
          uid: null,
          created_at: null
        },
        chatDisable: false,
        loader: false,
        typing: false,
        snackbar: false,
        snackbarMsg: null
      }
    },
    created: function() {
      const self = this;
      this.loader = true;
      firebase.app.auth().onAuthStateChanged(function(user) {
        if (!user) {
          self.$router.push('/')
        } else {
          self.getMessages()
          self.chat.uid = user.uid;
          self.watchIfSomeoneIsTyping();
          self.watchLikes();
        }
      });
    },
    methods: {
      getMessages: function() {
        const self = this;
        messages.onSnapshot(function(messagesSnapshot) { // get all mesasges
          self.loader = false;
          // check for added changes only and push in the messages array
          messagesSnapshot.docChanges.forEach(function(change) {
            if(change.type === "added") {
              var messageDoc = change.doc.data();
              // get user data by uid
              users.where("uid", "==", messageDoc.uid).get()
              .then(function(usersDoc) {
                usersDoc.forEach(function(ud) {
                  if(ud.exists) {
                    var message = {
                      uid: messageDoc.uid,
                      messageId: change.doc.id,
                      text: messageDoc.text,
                      imageUrl: ud.data().imgUrl,
                      fullName: ud.data().fullName,
                      created_at: messageDoc.created_at,
                      likes: messageDoc.likes
                    }
                    var chatContainer = document.querySelector('#chat-container');
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                    self.messages.push(message);          
                  }
                })
              })
              .catch(function(error) {
                  console.log("Error getting document:", error);
              });
            }
          })
        })
      },
      send: function() {
        if(!this.chat.text) return false;
        const self = this;
        this.chatDisable = true;
        this.chat.created_at = Date.now();
        this.chat.likes = [];
        messages.add(this.chat).then(function() {
          self.popup('Message sent!');
          self.chat.text = null;
          setTimeout(function() {
            self.chatDisable = false; // to avoid spam
          }, 5000);
        });
      },
      like: function(message_id) {
        const self = this;
        messages.doc(message_id).get()
        .then(function(doc) {
          if(doc.exists) {
            var likes = doc.data().likes;
            if(likes.includes(self.chat.uid)) {
              self.popup('You already liked this.');
            } else {
              likes.push(self.chat.uid);
              messages.doc(message_id).update({ likes: likes })
              .then(function() {
                self.popup('You liked this.');
              })
              .catch(function(error) {
                self.popup('An error occured.');
                console.log(error);
              });
            }
          }

        })
      },
      popup: function(message) {
        this.snackbarMsg = message;
        this.snackbar = true;
      },
      watchIfSomeoneIsTyping: function() {
        const self = this;
        typingStatus.onSnapshot(function(snapshot) {
          snapshot.docChanges.forEach(function(change) {
            if(change.type === "modified") {
              if(change.doc.data().typing) {
                self.typing = true;
              } else {
                self.typing = false;
              }
            }
          })
        })
      },
      watchLikes: function() {
        const self = this;
        messages.onSnapshot(function(messagesSnapshot) { // get all mesasges
          self.loader = false;
          // check for added changes only and push in the messages array
          messagesSnapshot.docChanges.forEach(function(change) {
            if(change.type === "modified") {
              var messageDoc = change.doc.data();
              messages.doc(change.doc.id).get()
              .then(function(doc) {
                if(doc.exists) {
                  var likes = doc.data().likes;
                  var messageIndex = self.messages.map(function(m) { return m.messageId }).indexOf(change.doc.id);
                  self.messages[messageIndex].likes = likes;
                }

              })
            }
          })
        })
      },
      checkIfUserLikedchat(uid, likes) {
        if(likes.includes(uid)) {
          return true;
        } else {
          return false;
        }
      }
    },
    watch: {
      'chat.text': function(val) {
        const self = this;
        if(!val) {
          typingStatus.doc('LuqypT8c3i0ctTbFmq32')
          .update({ typing: false })
          .then(function() {
            self.typing = false;
          });
        } else {
          typingStatus.doc('LuqypT8c3i0ctTbFmq32')
          .update({ typing: true })
          .then(function() {
            self.typing = true;
          });
        }
      }
    }
  }
</script>

<style scoped>
  #chat-container {
    height: 55vh;
    overflow-y: scroll;
  }

  .date {
    font-size: 12px;
  }

  .fade-enter-active, .fade-leave-active {
  transition: opacity .5s
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
</style>
  