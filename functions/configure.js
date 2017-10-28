module.exports = function(app, fbRef) {
  const express = require('express');
  const session = require('express-session');
  const FirebaseStore = require('connect-session-firebase')(session);
  const bodyParser = require('body-parser');
  const cookieParser = require('cookie-parser');

  app.set('view engine', 'ejs');

  // need to set multi view
//  app.set('views', [__dirname + '/view', __dirname + '/game/ship/view']);
  app.set('views', __dirname + '/view');

  // cookie
  //app.use(cookieParser());
  // session security
  app.set('trust proxy', 1); // trust first proxy
  app.use(session({
    store: new FirebaseStore({
      database: fbRef.database()
    }),
    secret: '!@h#$s%b^&08*(hsb0818)!',
    proxy: true,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
/*
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60),
      maxAge: 1000 * 60 * 60, // 1 hour
*/

  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({extended:true})); // to support URL-encoded bodies
  app.use(express.static('../public'));
};
