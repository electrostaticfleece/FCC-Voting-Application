import React, { PropTypes, Component } from 'react';
import Chart from 'chart.js';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/polls';
import { incrementCount } from 'actions/polls';

const cx = classNames.bind(styles);

class Poll extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount(){
    const { poll, formatPollData } = this.props;
    let chartCanvas = this.refs.chart;

    let myChart = new Chart(chartCanvas, {
      type: 'doughnut',
      data: formatPollData(poll.currentPoll.options),
      options: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            padding: 30
          }
        }
      }
    });

    this.setState({chart: myChart})
  }
  
  componentDidUpdate () {
    let chart = this.state.chart;

    const { poll, formatPollData, incrementCount } = this.props;
    const data = formatPollData(poll.currentPoll.options);
    const pollData = { pollId: poll.currentPoll.id, itemId: poll.currentPoll.options[0].id }

    data.datasets.forEach((dataset, i) => {
      return chart.data.datasets[i].data = dataset.data
    });

    chart.data.labels = data.labels;
    chart.update();
  }

  displayInput(){
    const { poll, incrementCount } = this.props; 
    
    return poll.currentPoll.options.map((opt, i) => {
      const data = { pollId: poll.currentPoll.id, itemId: opt.id }
      return (
        <button key={i} className={cx('voteBtn')} onClick={ () => incrementCount(data) } >
          {opt.item}
        </button>
      )
    })
  }

  render() {
    const { poll, message } = this.props;
    return (
      <div>
        <h2 className={cx('title')}>{poll.currentPoll.name}</h2>
        <p className={cx('message')}>{message.message}</p>
        <div className={cx('poll')}>
          <div className={cx('input')}>
            {this.displayInput()}
          </div>
          <div className={cx('layout')}>
            <canvas width="400px" height="400px" ref={'chart'}></canvas>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    poll: state.poll,
    message: state.message
  }
}

export default connect(mapStateToProps, { incrementCount })(Poll);