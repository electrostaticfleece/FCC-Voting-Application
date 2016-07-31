import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createPoll } from 'actions/polls'

import PollInput from 'components/PollInput';
import Layout from 'components/Layout';




class CreatePollInput extends Component {

  render() {
    const { createPoll, user } = this.props
    return (
      <div>
        <Layout>
          <PollInput createPoll={ createPoll } />
        </Layout>
      </div>
    )
  }
}

CreatePollInput.propTypes = {
  createPoll: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: state.user,
  }
} 

export default connect(mapStateToProps, {createPoll})(CreatePollInput)