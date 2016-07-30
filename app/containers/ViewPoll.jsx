import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { fetchPoll, incrementCount } from 'actions/polls';


import Layout from 'components/Layout';
import Poll from 'containers/Poll';

class ViewPoll extends Component {
  constructor(props){
    super(props);
    const { params: { pollId }, fetchPoll, poll, incrementCount } = this.props;
    fetchPoll(pollId);
  }

  formatPollData(options) {
    const data = options.map((opt) => opt.count);
    const labels = options.map((opt) => opt.item);
    const backgroundColor = [ "#1abc9c", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e74c3c", "#ecf0f1", "000000" ];
    const hoverBackgroundColor = [ "#9ff2e1", "#a7d3ef", "#dbc3e5", "#b9c8d8", "#f8e48f", "#f29f97", "#b1c2c6", "#555555"  ];

    const pollData = {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: backgroundColor,
        hoverBackgroundColor: hoverBackgroundColor
      }]
    }

    return pollData;
  }

  render() {
    const { poll } = this.props;
    return (
      <div>
        <Layout>
            <Poll formatPollData = { this.formatPollData } />
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

export default connect(mapStateToProps, { fetchPoll })(ViewPoll)