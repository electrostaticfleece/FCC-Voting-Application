import Models from '../models';

const User = Models.User;

export default (id, done) => {
  User.findById(id).then((user) => {
    console.log('deserializing user');
    done(null, user);
    return null;
  }).catch((err) => {
    if(err){
      console.log('Error encountered when serializing user: ', err);
    }
  });
};