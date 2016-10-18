import passport from 'passport';
import unsupportedMessage from '../db/unsupportedMessage';
import  { controllers, passport as passportConfig } from '../db';

const usersController = controllers && controllers.users;
const pollsController = controllers && controllers.polls;

export default(app) => {

  if(usersController){
    app.get('/logout', usersController.logout)
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
        failureRedirect: '/'
      }), (req, res) =>
        req.session.save((err) => {
          if(err){
            console.log('Error: unable to save session before redirect');
          } else {
            res.redirect('/')
          }
        })
    );
  }

  if(pollsController) {
    app.get('/allpolls', pollsController.all)
    app.post('/poll/:id', pollsController.add);
    app.get('/poll/:id', pollsController.single);
    app.put('/poll/:id', pollsController.increment);
    app.delete('/poll/:id', pollsController.remove);
  }



  //TODO: Add additional controllers for routing w/r/t
  // poll request information.
}