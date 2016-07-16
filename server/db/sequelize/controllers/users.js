import passport from 'passport';

export function logout(req, res){
  req.logout();
  res.redirect('/');
}

export default {
  logout
};