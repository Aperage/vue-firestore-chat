import Vue from 'vue';
import firebase from "firebase";
import 'firebase/firestore';

const config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};

export const app = firebase.initializeApp(config);
export const usersCollection = firebase.firestore().collection('users');
export const messagesCollection = firebase.firestore().collection('messages');
export const typingStatus = firebase.firestore().collection('typing-status');
export const likesCollection = firebase.firestore().collection('likes');