import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut } from 'actions/users';

import classNames from 'classnames/bind';
import styles from 'css/components/navigation';

const cx = ClassNames.bind(styles);

const Navigation = ({ user, logOut }) => {
  return (
    <nav className={cx('navigation')} role="navigation">
     <Link to='/'>Home</Link>
      { user.authenticated ?
        ( <Link onClick={ logOut } to='/'>Logout</Link> ) : 
        ( <a href="/auth/google">Google Login</a> )
      }
    </nav>
  );
};

Navigation.propTypes = {
  user: PropTypes.object,
  logOut: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

export default connect(mapStateToProps, { logOut } )(Navigation);