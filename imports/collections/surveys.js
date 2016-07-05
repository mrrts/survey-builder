import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const Surveys = new Mongo.Collection('surveys');

Meteor.methods({
  'surveys.insert': function (surveyData) {
    const {courseId, title} = surveyData;
    check(courseId, String);
    check(title, String);

    Surveys.insert({
      createdAt: new Date(),
      title: title,
      creatorId: this.userId,
      courseId: courseId,
      questions: [],
    });
  },

  'survey.remove': function (surveyId) {
    check(surveyId, String);
    Surveys.remove(surveyId);
  },

  'survey.update': function (surveyData) {
    const {surveyId, title, courseId, questions} = surveyData;
    Surveys.update(surveyId, {
      $set: {
        title,
        courseId,
        questions,
      }
    });
  },
});