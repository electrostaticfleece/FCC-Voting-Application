import Models from '../models';
const Poll = Models.Poll;
const Item = Models.Item;
const sequelize = Models.sequelize; 

function getPollData(poll, user){
  const isOwner = (poll.userId === user);
  return {question: poll.question, pollId: poll.pollId, isOwner: isOwner };
}

//ADD POLL AND ITEMS TO DATABASE

export function all(req, res) {

  const user = (typeof req.user === 'undefined') ? null : req.user.id;

  //Find all polls 
  Poll.findAll().then((polls) => {
    const allPolls = polls.map((poll) => {
      return getPollData(poll, user);
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
  Poll.find({ where: query }).then(function(poll){

    //If the voter has already voted then don't allow them to vote.
    if(poll.voters.indexOf(voter) !== -1){
      res.status(204).send('We cannot add your vote because you voted already');
      return null;
    }

    //Increment the count on the item by one.
      if(updateType === 'increment'){
        Item.update({ 
          count: sequelize.literal('count+1')
        }, { where: { id: item } }).then(() => {
          poll.voters.push(voter);
          //Add the user to the list of voters who have already voted.
          Poll.update({ voters: poll.voters }, { where: query }).then(() => {
            res.status(200).send('OK: We added your vote');
            return true;
          });
          return true;
        });
        return true;
      }
      //Add the item and set the count to one. 

      if(updateType === 'add'){
        let itemId;
        Item.create({
          item: item,
          count: 1,
          poll: req.params.id
        }).then((item) => {
          itemId = item.id;
          poll.voters.push(voter);
          //Add the user to the list of voters who have already voted.
          Poll.update({ voters: poll.voters }, { where: query }).then(() => {
            res.json({id: itemId});
            return true;
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).send('Something went wrong and we could not update')
    })

}

export function remove(req, res){
  const id = req.params.id;
  const query = { poll: id }
  const user = req.user.id;

  Item.findAll({where: query}).then((items) => {
    items.forEach((item) => {
      item.destroy();
    });
    return true;
  }).then(() => {
    Poll.findAll().then((polls) => {
      const allPolls = polls.filter((poll) => {
        if(poll.pollId === req.params.id){
          poll.destroy();
          return false; 
        }
        return true;
      }).map((poll) => {
        return getPollData(poll, user);
      });
      res.json(allPolls);
    })
    return true;
  }).catch((err) => {
    res.status(500).send('Something went wrong. We could not destroy your poll.')
  })
}

export default {
  add,
  all,
  increment,
  remove,
  single,
}