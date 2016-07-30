import passport from 'passport';
import google from './passport/google';
import { passport as dbPassport } from '../db';
import unspportedMessage from '../db/unsupportedMessage';

export default() => {

  if(dbPassport && dbPassport.deserializeUser){
    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(dbPassport.deserializeUser);
  } else {
  console.warn(unsupportedMessage('(de)serialize User'));
  }

  google(passport);
};

