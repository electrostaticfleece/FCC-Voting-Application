import React, { PropTypes, Component } from 'react';
import Chart from 'chart.js';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';
import styles from 'css/components/polls';
import { incrementCount, addOption } from 'actions/polls';

const cx = classNames.bind(styles);

class Poll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    }
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

  addPollOption(){
    const { user } = this.props;
    if(user.authenticated){
      return(
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" ref="newOption" placeholder="Add your own poll Option" />
          <input type="submit"/>
        </form>
      )
    }
    return;
  }

  handleSubmit(e){
    e.preventDefault();
    const { addOption, poll: { currentPoll: { id } } } = this.props;
    const option = this.refs.newOption.value.trim();
    const data = {
      option, 
      pollId: id
    };
    
    if(option.length <=0){
      console.log('The option must not be empty');
      return;
    }

    if(this.state.submitted === false ){
      addOption(data);
    }
    this.setState({submitted: true});
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
        <div>
        {this.addPollOption()}
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    poll: state.poll,
    message: state.message,
    user: state.user
  }
}

export default connect(mapStateToProps, { incrementCount, addOption })(Poll);