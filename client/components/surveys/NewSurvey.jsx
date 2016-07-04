import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';

import {Courses} from '../../../imports/collections/courses';

class NewSurvey extends Component {
  render() {
    return (
        <div>
          New Survey
        </div>
      )
  }
}

export default createContainer(() => {
  Meteor.subscribe('courses');
  return {
    courses: Courses.find({}).fetch()
  }
}, NewSurvey);