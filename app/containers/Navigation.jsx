import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { logOut } from 'actions/users';

import classNames from 'classnames/bind';
import styles from 'css/components/navigation';

const cx = classNames.bind(styles);

class Navigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      authLinks: [
        { Name: 'My Polls', LinkTo: '/mypolls'},
        { Name: 'Create Poll', LinkTo: '/createpoll'},
        { Name: 'Logout', LinkTo: '', onClick: this.props.logOut},
      ]
    };
    
  }

  dynamicLinks() {
    const { user } = this.props;
    return (user.authenticated) ? 
      this.state.authLinks.map((link, i) => 
        ( <Link to={link.LinkTo} onClick={link.onClick} key={i}>
            {link.Name}
          </Link> 
        )) :
        <a href="/auth/google">Google Login</a>
  }

  render() {
    return (
      <nav className={cx('navigation')} role="navigation">
        <Link to='/'>Home</Link>
        {this.dynamicLinks()}
      </nav>
    )
  }
}

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