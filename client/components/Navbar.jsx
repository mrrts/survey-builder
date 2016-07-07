import React, {Component} from 'react';
import {Link} from 'react-router';
import activeComponent from 'react-router-active-component';
import {createContainer} from 'meteor/react-meteor-data';
var NavbarLink = activeComponent('li');

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
                      <NavbarLink to="/" activeClassName="active">My Surveys</NavbarLink>
                      <li><a onClick={this.handleLogout.bind(this)} href="#">Logout</a></li>
                    </ul>
                  ) 
                  
                  : 

                  (
                    <ul className="nav navbar-nav navbar-right">
                      <NavbarLink to="/login">Log In</NavbarLink>
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