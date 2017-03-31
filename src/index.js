import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import firebase from 'firebase';

let config = {
    apiKey: "AIzaSyBhWO3XTGYUbvVe1dKSPFBbVxgxpLVrkmI",
    authDomain: "reactgram-3eee0.firebaseapp.com",
    databaseURL: "https://reactgram-3eee0.firebaseio.com",
    projectId: "reactgram-3eee0",
    storageBucket: "reactgram-3eee0.appspot.com",
    messagingSenderId: "911138207745"
};

firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
