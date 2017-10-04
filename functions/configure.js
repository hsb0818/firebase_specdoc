module.exports = function(app) {
  let express = require('express');
  let body_parser = require('body-parser');

  app.set('view engine', 'ejs');

  // need to set multi view
//  app.set('views', [__dirname + '/view', __dirname + '/game/ship/view']);
  app.set('views', __dirname + '/view');

  // session security
  app.set('trust proxy', 1); // trust first proxy
  app.use(require('express-session')({
    name : 'sessionId',
    secret: '!@h#$s%b^&08*()18',
    resave: false,
    saveUninitialized: true
  }));

  // cookie sequrity
  /*
  let expiryDate = new Date( Date.now() + 60 * 60 * 1000 ); // 1 hour
  app.use(require('cookie-session')({
    name: 'session',
    keys: ['key1', 'key2'],
    cookie: {
      secure: false,
      httpOnly: true,
  //    domain: 'example.com',
      path: 'foo/bar',
      expires: expiryDate
    }
  }));
  */

  app.use(express.static('./public'));
  app.use(body_parser.json()); // to support JSON-encoded bodies
  app.use(body_parser.urlencoded({extended:true})); // to support URL-encoded bodies
};
