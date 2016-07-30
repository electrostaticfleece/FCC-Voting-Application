import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { fetchPolls, deletePoll } from 'actions/polls'

import Layout from 'components/Layout'
import PollNames from 'components/PollNames'


class MyPolls extends Component {
  constructor(props){
    super(props);
    const { fetchPolls } = this.props;
    fetchPolls();
  }

  listPolls(){
    const { poll: {allPolls} } = this.props;
    if(Array.isArray(allPolls)){
      return allPolls.filter((poll) =>  
      poll.isOwner ).map((poll) =>
      ( <PollNames alt = {true} poll = { poll } /> )
      );  
    } 
    return;
  }

  render() {
    return (
      <div>
        <Layout>
          <div>
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

export default connect(mapStateToProps, {fetchPolls})(MyPolls)