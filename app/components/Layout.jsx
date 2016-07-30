import React, { Component } from 'react';
import classNames from 'classnames/bind'
import styles from 'css/components/layout'

const cx = classNames.bind(styles);

const Layout = ({children}) => {
  return (
    <div className={cx('layout')} >
      {children}
    </div>
  );
};

export default Layout;