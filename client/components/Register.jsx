import React, {Component} from 'react';
import {browserHistory} from 'react-router';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {email: '', password: ''};
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    Accounts.createUser({ email, password });
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        console.log(err);
      } else {
        browserHistory.push('/')
      }
    });
  }

  render() {
    return (
        <form onSubmit={this.handleSubmit.bind(this)}>
          <h3>Sign Up</h3>
          <div className="form-group">
            <input className="form-control" type="email" ref="email" name="email" placeholder="Email address" />
          </div>
          <div className="form-group">
            <input className="form-control" type="password" ref="password" name="password" placeholder="Password" />
          </div>
          <button className="btn btn-primary">
            Register
          </button>
        </form>
      )
  }
}