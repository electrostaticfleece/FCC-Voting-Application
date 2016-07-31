import React, { PropTypes, Component } from 'react';
import { connect } from  'react-redux';
import { Link } from 'react-router';
import styles from 'css/components/pollNames';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const PollNames = ({poll, alt, button}) => {
  const altTile = alt ? ['tileAlt', 'colorAlt'] : ['', ''];
  return (
    <div className={cx('tile', altTile[0])} >
      <li><Link className={cx('pollName', altTile[1])} to={'view/' + poll.pollId}>{poll.question}</Link></li>
      <div className={cx('button')}>{button(poll.pollId)}</div>
    </div>
  )
}

PollNames.propTypes ={
  poll: PropTypes.object.isRequired
}


export default PollNames;