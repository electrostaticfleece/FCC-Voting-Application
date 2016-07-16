import passport from 'passport';
import unsupportedMessage from '../db/unsupportedMessage';
import  { controllers, passport as passportConfig } from '../db';

const usersController = controllers && controllers.users;

export default(app) => {

  if(usersController){
    app.post('/logout', usersController.logout)
  } else {
    console.warn(unsupportedMessage('users routes'));
  }

  /* For google authentication. 
   * Redirect the user to Google for authentication. When complete, Google
   * will redirect the user back to the application at:
   *    - /auth/google/return
   * Authentication with google requires an additional scope param, that specifies
   * the requested API information you would like to retrieve. 
   */

  if(passportConfig && passportConfig.google) {

    app.get('/auth/google', passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }));


    app.get('/auth/google/callback',
      passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/'
      })
    );
  }

  //TODO: Add additional controllers for routing w/r/t
  // poll request information.
}