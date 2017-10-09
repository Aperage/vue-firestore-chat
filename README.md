# vue-firestore-chat

> A Vue.js and Cloud Firestore chat application.

## Firestore Setup

This app used Google firestore to save backend database.

To setup the same, follow these steps:

- Visit https://console.firebase.google.com/ Login with your google account, if needed.
- Create a New project

![image](https://raw.githubusercontent.com/techsethi/vue-firestore-chat/master/static/fb_console1.png)

- Click on Settings > Project Settings

- Copy Project ID & API Key

![image](https://raw.githubusercontent.com/techsethi/vue-firestore-chat/master/static/console2.png)

- Replace these values in src/firebase/config.js

```
const config = {
  apiKey: "xxxxxxxxxxxxxxxx-xxxxxxxxxxxxx",
  authDomain: "",
  databaseURL: "",
  projectId: "xxxxxxxxxxxxx",
  storageBucket: "",
  messagingSenderId: ""
};

```
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
