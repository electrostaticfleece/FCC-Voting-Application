import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchPolls } from 'actions/polls';

import classNames from 'classnames/bind';
import styles from 'css/components/home';

import PollNames from 'components/PollNames';


const cx = classNames.bind(styles);

class Home extends Component {
  constructor(props) {
    super(props);
  }

  //Data that needs to be called before rendering the component.
  //This is used for server side rendering via the preRenderMiddleware.
  static need = [
    fetchPolls
  ]

  segmentPolls(sets, total){
    const { poll: { allPolls } } = this.props;
    if(typeof allPolls === 'undefined'){
      return;
    }
    const slicePoint = allPolls.length - total;
    const setsOf = total/sets; 
    const lastPolls = allPolls.slice(slicePoint);
    let polls = [];
    
    return lastPolls.reduce((prev, curr, i) => {
      const setNum = (i+1)/setsOf;

      if(Number.isInteger(setNum) && i > 0){

        polls.push(prev.concat(curr).slice(-setsOf))
        return polls;

      } else {

        return prev.concat(curr);

      }
    }, []).map((set, i) => {

      return (
        <div key ={i} className={cx('pollGroup')}>
          <ul key={i} >
            {set.map((poll) => (<PollNames poll = { poll } key={poll.pollId} />))}
          </ul>
        </div>
      )
    })
  }


  render() {
    return (
      <div>
        <div className={cx('display')}>
          <h1 className={cx('coll')}>COLL</h1><h1 className={cx('i', 'red')}>I</h1><h1 className={cx('sion')}>SION</h1>
          <p className={cx('slogan')}>Where <span className={cx('red')}><strong>opposing forces</strong></span> face off to decide which opinions reign supreme</p>
        </div>
        <div className={cx('polls')}>
          <div className={cx('titleWrap')} >
            <h2>Polls</h2>
          </div>
          <div className={cx('columnGroup')}>
              {this.segmentPolls(3, 12)}
          </div>
        </div>
      </div>
    );
  }
};

function mapStateToProps(state) {
  return {
    poll: state.poll
  };
}

export default connect(mapStateToProps)(Home);
