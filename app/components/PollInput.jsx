import React, { PropTypes, Component } from 'react';
import classNames from 'classnames/bind';
import styles from 'css/components/formInput';

const cx = classNames.bind(styles);


class PollInput extends Component {
  constructor(props){
    super(props);
    this.state = {
      options: [
      {id: 1},
      {id: 2},
      {id: 3}
      ],
      errorMessage: '',
      submitted: false
    };
    this.addOption = this.addOption.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getOptionValues() {
    const { options } = this.state;
    return options.map((option) => 
      this.refs[option.id].value
    );

  }

  handleSubmit(e){
    e.preventDefault();
    const { createPoll } = this.props;
    const { user } = this.props;
    const name = this.refs.name.value;
    const values = this.getOptionValues();
    const data = {
      name: name,
      options: values
    };
    console.log(this.state.submitted);
    if(this.state.submitted === false){
      createPoll(data);
    }
    this.setState({submitted: true})
  }

  addOption(e) {
    e.preventDefault();

    const { options } = this.state;
    const key = options.slice(-1)[0].id + 1;

    options.push({id: key, ph: 'Input field ' + key});
    this.setState({ options: options, errorMessage: '' });
  }

  deleteOption(e, option) {
    e.preventDefault();
    const { options } = this.state;

    if(options.length === 1){
      this.setState({errorMessage: '*You can\'t have less than one option'});
      return;
    } 

    options.splice(options.indexOf(option), 1);
    this.setState({ options: options, errorMessage: ''});
  }

  options() {
    const { options } = this.state;
    return options.map((option, i) => 
      (
        <div className={cx('inputBlock')} key={option.id} >
          <div className={cx('wrapper')}>
            <input type="text" className={cx('inputField')} ref={option.id} placeholder={'Input Field ' + (i+1)} />
          </div>
          <div className={cx('wrapper')}>
            <input type="button" className={cx('deleteButton')} onClick={e => this.deleteOption(e, option)} value="Delete" />
          </div>
        </div>
      )
    )
  }

  render() {
    return (
      <div className={cx('innerContent')}>
        <h2 className={cx('pollTitle')}>Create a Poll</h2>
        <form ref="commentForm" onSubmit={this.handleSubmit}>
          <span className={cx('inputBlock', 'nameBlock')} >
            <input type="text" className={cx('inputField')} ref="name" placeholder="Poll Question" />
          </span>
          {this.options()}
          <input type="button" onClick={this.addOption} value="Add Field" />
          <input type="submit"/>
        </form>
        <p className={cx('errorMessage')}>{this.state.errorMessage}</p>
      </div>
    )
  }
}

export default PollInput;