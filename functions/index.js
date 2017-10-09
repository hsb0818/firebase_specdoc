// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const firebase = require('firebase-admin');
const functions = require('firebase-functions');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const ejs = require('ejs');

const serviceAccount = require("./auth/serviceAccountKey.json");
const fbRef = firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://teraphonia.firebaseio.com"
});

require('./configure')(app, fbRef);

const database = firebase.database();

app.get('/', (req, res) => {
  req.session.myid = 'hsb0818';
  const isAdmin = (req.session.hasOwnProperty('uid')) ? true : false;

  res.render('home', {
    title: "Home",
    isAdmin: isAdmin
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: "Login",
    myid: req.session.myid,
  });
});

app.get('/writing', (req, res) => {
  const isAdmin = (req.session.hasOwnProperty('uid')) ? true : false;
  if (isAdmin === false) {
    res.send('u r not admin');
    return;
  }

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

app.post('/loginAuth', (req, res) => {
  if (req.body.hasOwnProperty('idToken') === false)
  {
    res.send(null);
    return;
  }

  const idToken = req.body.idToken;
  firebase.auth().verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    req.session.uid = uid;
    res.send(req.session.uid);
  })
  .catch((error) => {
    res.send(null);
  });
});

app.post('/logoutAuth', (req, res) => {
  req.session.destroy();
  res.send(true);
});

exports.app = functions.https.onRequest(app);
