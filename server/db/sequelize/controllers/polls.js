import Models from '../models';
const Poll = Models.Poll;
const Item = Models.Item;
const sequelize = Models.sequelize; 

//ADD POLL AND ITEMS TO DATABASE

export function all(req, res) {
  const user = (typeof req.user === 'undefined') ? null : req.user.id;
  //Find all polls 
  Poll.findAll().then((polls) => {
    const allPolls = polls.map((poll) => {

      const isOwner = (poll.userId === user);
      return {question: poll.question, pollId: poll.pollId, isOwner: isOwner };

    });
    res.json(allPolls);
  }).catch((err) => {
    res.status(400).send(err);
  })
}

export function add(req, res) {
  const { body } = req;

  body.poll.userId = req.user.dataValues.id;

  //For each item create a poll item in the items database
  //each with a reference to the poll id. Additionaly, an
  //a unique id is generated for each item. 
  Poll.create(body.poll).then(() => {
    body.items.forEach((item) => {
      Item.create({
        item: item,
        count: 0,
        poll: body.poll.pollId
      });
    });
    return null;

  }).then(() => {
    res.status(200).send('OK');
    return null;

  }).catch((err) => {
    res.status(400).send(err);
  });
}

//GET A SINGLE INSTANCE OF A POLL & ITMES FROM THE DATABASE

export function single(req, res){
  const query = { pollId: req.params.id };

  Poll.findAll({ include: [ Item ], where: query }).then((polls) => {
    res.json(polls);

  }).catch((err) => {
    res.status(500).send('Error in query');
  })
}

//INCREMENT THE POLL 

export function increment(req, res){
  const { body: { item, updateType }} = req;
  const query = { pollId: req.params.id };
  let voter = (req.headers['x-forwarded-for'] || '').split(',')[0] 
        || req.connection.remoteAddress;

  //If the voter is authenticated use their passport user id and
  //convert the id to a string because IP addresses and user ids
  //are currently stored in the same array in the database as strings. 
  if(typeof req.user !== 'undefined'){
    voter = req.user.id.toString();
  }

  //If the update type is increment then find the poll and increment it.
  if(updateType === 'increment'){
    Poll.find({ where: query }).then(function(poll){

      //If the voter has already voted then don't allow them to vote.
      if(poll.voters.indexOf(voter) !== -1){
        res.status(204).send('We cannot add your vote because you voted already');
        return null;
      } else {

        //Increment the count on the item by one.
        Item.update({ 
          count: sequelize.literal('count+1')
        }, { where: { id: item } }).then(() => {
          poll.voters.push(voter);

          //Add the user to the list of voters who have already voted.
          Poll.update({ voters: poll.voters }, { where: query }).then(() => {
            res.status(200).send('OK: We added your vote');
            return null;
          });
          return null;
        });
        return null;
      }
    })
    .catch((err) => {
      res.status(500).send('Something went wrong and we could not update')
    })
  }

}

export function remove(req, res){
  const query = { pollId: req.params.id };
  const query2 = { poll: req.params.id };

  Item.findAll({where: query2 }).then((items) => {
    items.forEach((item) => {
      item.destroy();
    });
  }).then(() => {
    Poll.findOne({where: query }).then((poll) => {
      poll.destroy();
    })
  }).then(() => {
    
  })
  .catch((err) => {
    res.status(500).send('Something went wrong and we could not delete your poll.')
  })
}

export default {
  add,
  all,
  increment,
  remove,
  single,
}