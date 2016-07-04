import React, {Component} from 'react';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';

class Navbar extends Component {
  handleLogout(e) {
    e.preventDefault();
    Meteor.logout();
  }

  render() {
    return (
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link className="navbar-brand" to="/">SurveyCreator</Link>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> 
                {this.props.currentUser ? 
                  (
                    <ul className="nav navbar-nav navbar-right">
                      <li><Link to="/surveys">My Surveys</Link></li>
                      <li><a onClick={this.handleLogout.bind(this)} href="#">Logout</a></li>
                    </ul>
                  ) 
                  
                  : 

                  (
                    <ul className="nav navbar-nav navbar-right">
                      <li><Link to="/register">Sign Up</Link></li>
                      <li><Link to="/login">Log In</Link></li>
                    </ul>
                  )
                }
                
            </div>
          </div>
        </nav>
      )
  }
}

export default createContainer(() => {
  return {
    currentUser: Meteor.user()
  } 
}, Navbar);