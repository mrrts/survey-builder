import React, {Component} from 'react';
import {browserHistory} from 'react-router';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.refs.email.value;
    const password = this.refs.password.value;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({error: 'Invalid username/password combination'});
      }
      else {
        this.setState({error: null});
        browserHistory.push('/');
      }
    })
  }

  render () {
    const err = this.state.error;
    return (
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="col-sm-8 col-sm-push-2 col-md-6 col-md-push-3">
            <h3>Log In</h3>
            <div className="form-group">
              <input ref="email" defaultValue="demo.course.author@example.com" className="form-control" placeholder="Email address" type="text" name="email" />
            </div>
            <div className="form-group">
              <input ref="password" defaultValue="demo123" className="form-control" placeholder="Password" type="password" name="password" />
            </div>
            {err ? <div className="alert alert-warning">{err}</div> : ''}
            <button type="submit" className="btn btn-primary">
              Log in
            </button> 
          </div>
        </form>
      )
  }
}