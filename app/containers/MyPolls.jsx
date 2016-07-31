import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { fetchPolls, destroyPoll } from 'actions/polls'

import Layout from 'components/Layout'
import PollNames from 'components/PollNames'

import classNames from 'classnames/bind';
import styles from 'css/components/myPolls';

const cx = classNames.bind(styles);

class MyPolls extends Component {
  constructor(props){
    super(props);
    const { fetchPolls } = this.props;
    fetchPolls();
  }

  deleteButton(pollId){
    const { destroyPoll } = this.props;
    return (
      <button className={cx('deleteButton')} onClick = { () => destroyPoll(pollId) } >
        Delete Poll
      </button>
    )
  }

  listPolls(){
    const { poll: {allPolls} } = this.props;
    if(Array.isArray(allPolls)){
      return allPolls.filter((poll) =>  
      poll.isOwner ).map((poll) =>
      ( <PollNames key = { poll.pollId } alt = {true} poll = { poll } button = { this.deleteButton.bind(this) } /> )
      );  
    } 
    return;
  }

  render() {
    return (
      <div>
        <Layout>
          <div>
            <h2 className={cx('myPollsHeader')} >My Polls</h2>
              <ul>
                {this.listPolls()}
              </ul>
          </div>
        </Layout>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return {
    user: state.user,
    poll: state.poll
  }
} 

export default connect(mapStateToProps, {fetchPolls, destroyPoll})(MyPolls)