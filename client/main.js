import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, browserHistory} from 'react-router';

import App from './components/App';
import Register from './components/Register';
import Login from './components/Login';
import SurveysList from './components/surveys/SurveysList';
import NewSurvey from './components/surveys/NewSurvey';


Meteor.startup(() => {
  ReactDOM.render( 
    <Router history={browserHistory}>
      <Route path='/' component={App}>
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/surveys' component={SurveysList} />
        <Route path='/surveys/new' component={NewSurvey} />
      </Route>
    </Router>
    , 
    document.getElementById('app-container'));
})
