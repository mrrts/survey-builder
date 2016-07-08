import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {Courses} from './courses';

export const Surveys = new Mongo.Collection('surveys');


function expandedSurveyObj (surveyObj) {
  const {_id, createdAt, title, creatorId, courseId, questions} = surveyObj;
  const streamlinedQuestions = questions.map((item) => {
    const {type, question} = item;
    const data = item[`${type}Data`];
    var streamlined = {
      question,
      type,
      data
    };     
    return streamlined;
  })
  const creator = Meteor.users.findOne({_id: creatorId});
  const course = Courses.findOne({_id: courseId});
  return {
    _id,
    title,
    createdAt,
    questions: streamlinedQuestions,
    course,
    creator: {
      _id: creator._id,
      createdAt: creator.createdAt,
      email: creator.emails[0].address
    },
  };
}


Meteor.methods({
  'surveys.insert': function (surveyData) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
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
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    check(surveyId, String);
    Surveys.remove(surveyId);
  },

  'survey.update': function (surveyData) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    const {surveyId, title, courseId, questions} = surveyData;
    Surveys.update(surveyId, {
      $set: {
        title,
        courseId,
        questions,
      }
    });
  },


  'survey.expandedCollectionForApi': function (isApiCall = false) {
    if (!this.userId && !isApiCall) {
      throw new Meteor.Error('not-authorized');
    }
    const surveys = Surveys.find({}).fetch();
    return surveys.map((survey) => {
      return expandedSurveyObj(survey);
    });
  },


  'survey.expandedObjForApi': function (surveyId, isApiCall = false) {
    if (!this.userId && !isApiCall) {
      throw new Meteor.Error('not-authorized');
    }
    const survey = Surveys.findOne({_id: surveyId});
    return expandedSurveyObj(survey);
  },
});

