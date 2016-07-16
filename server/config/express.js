import express from 'express';
import passport from 'passport';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import flash from 'express-flash';
import methodOverride from 'method-override';
import unsupportedMessage from '../db/unsupportedMessage';
import { sessionSecret } from './secrets';
import { DB_TYPE, ENV } from './appConfig';
import { session as dbSession } from '../db';

export default(app) => {
  let sessionStore = null;

  app.set('port', (process.env.PORT || 5000));

  /* * 
   * X-Powered-By header has no functional value.
   * Keeping it makes it easier for an attacker to build the site's profile
   * It can be removed safely
   */

  app.disable('x-powered-by');

  app.use(bodyParser.json());
  //for parsing application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(methodOverride()); 
  app.use(express.static(path.join(__dirname, '../..', 'public')));

  /* *
   * Indicates the app is behind a front-facing proxy,
   * and to use the X-Forwarded-* headers to determine the connection and the IP address of the client.
   */

  app.set('trust proxy', 'loopback');

  if(!dbSession) {
    console.warn(unsupportedMessage('session'));
  } else {
    sessionStore = dbSession();
  }

  const sess = {
    resave: true,
    saveUninitialized: false,
    secret: sessionSecret, 
    proxy: true, //The "X-Forwarded-Proto" header will be used.
    name: 'sessionId',
    cookie: {
      httpOnly: true,
      secure: false
    },
    store: sessionStore 
  };

  app.use(session(sess));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(flash());
}
