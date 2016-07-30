import passport from 'passport';

export function logout(req, res){
  req.logout();
  req.session.save((err) => {
    if(err){
      console.log('Unable to logout user: ', err)
    } else {
      res.redirect('/');
    }
  })
}

export default {
  logout
};