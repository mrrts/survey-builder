import { Meteor } from 'meteor/meteor';
import {Surveys} from '../imports/collections/surveys';
import {Courses} from '../imports/collections/courses';
import _ from 'lodash';

Meteor.startup(() => {
  // code to run on server at startup

  // publish the logged-in user's surveys only
  Meteor.publish('surveys', function () {
    return Surveys.find({creator: this.userId});
  });


  // publish a non-access-controlled list of courses for prototype
  Meteor.publish('courses', function () {
    return Courses.find({});
  });
  // Seed db with default courses
  if (Courses.find({}).count() === 0) {
    var i = 1;
    _.times(3, () => {
      Courses.insert({
        title: `PSYCH 20${i}`
      });
      i++;
    })
  }
});
