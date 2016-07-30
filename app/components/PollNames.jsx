import React, { PropTypes, Component } from 'react';
import { connect } from  'react-redux';
import { Link } from 'react-router';
import styles from 'css/components/pollNames'


import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PollNames = ({poll, alt}) => {
  const altTile = alt ? ['tileAlt', 'colorAlt'] : ['', ''];
  return (
    <div>
    <li className={cx('tile', altTile[0])} ><Link  className={cx('pollName', altTile[1])} to={'view/' + poll.pollId}>{poll.question}</Link></li>
    </div>
  )
}

PollNames.propTypes ={
  poll: PropTypes.object.isRequired
}


export default PollNames;