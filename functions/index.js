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

const serviceAccount = require("./serviceAccountKey.json");
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

app.post('/document', (req, res) => {
  const isAdmin = (req.session.hasOwnProperty('uid')) ? true : false;
  if (isAdmin === false) {
    res.send('u r not admin');
    return;
  }

  res.render('writing', {
    title: 'Writing',
    main: req.body.main,
    sub: req.body.sub
  });
});

app.get('/document', (req, res) => {
  res.render('reading', {
    title: 'Reading',
    main: req.query.main,
    sub: req.query.sub
  });
});

app.post('/modifying', (req, res) => {
  const isAdmin = (req.session.hasOwnProperty('uid')) ? true : false;
  if (isAdmin === false) {
    res.send('u r not admin');
    return;
  }

  res.render('modifying', {
    title: 'Modifying',
    main: req.body.main,
    sub: req.body.sub
  });
});

app.post('/login', (req, res) => {
  if (req.body.hasOwnProperty('idToken') === false) {
    res.status(401).send('Unauthorized');
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

app.delete('/login', (req, res) => {
  req.session.destroy();
  res.send(true);
});

/*
app.get('/refactoring', (req, res) => {
  res.render('base', {
    main: req.query.main
  });
});
*/

exports.app = functions.https.onRequest(app);
/*
const http = require('http');
const https = require('https');
const fs = require('fs');
const options = {
  key: fs.readFileSync('./auth/private.pem'),
  cert: fs.readFileSync('./auth/public.pem')
};
app.set('port', process.env.PORT || 9220);

http.createServer(app).listen(app.get('port'), () => {
  console.log('http server listening port ' + app.get('port'));
});

https.createServer(options, app).listen(9221, () => {
  console.log('https server listening port 9221');
});
*/
