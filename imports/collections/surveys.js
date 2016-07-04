import {Mongo} from 'meteor/mongo';

export const Surveys = new Mongo.Collection('surveys');

Meteor.methods({
  'surveys.insert': function (surveyData) {
    const {courseId} = surveyData;
    Surveys.insert({
      creatorId: this.userId,
      courseId: courseId,
      questions: []
    });
  }
});