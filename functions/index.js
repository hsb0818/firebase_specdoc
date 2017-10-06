// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const ejs = require('ejs');

firebase.initializeApp(functions.config().firebase);
const database = firebase.database();

require('./configure')(app);

app.get('/', (req, res) => {
  res.render('login', {
    title: "Login"
  });
});

app.get('/home', (req, res) => {
  res.render('home', {
    title: "Home"
  });
});

app.get('/writing', (req, res) => {
  res.render('writing', {
    title: 'Writing',
    pageNum: req.query.pageNum
  });
});

app.get('/reading', (req, res) => {
  res.render('reading', {
    title: 'Reading',
    main: req.query.main,
    sub: req.query.sub
  });
});

exports.app = functions.https.onRequest(app);
