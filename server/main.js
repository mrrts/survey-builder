import { Meteor } from 'meteor/meteor';
import {Surveys} from '../imports/collections/surveys';
import {Courses} from '../imports/collections/courses';
import {WebApp} from 'meteor/webapp';
import ConnectRoute from 'connect-route';
import _ from 'lodash';



const middlewareAPIRedirector = ConnectRoute(function(router) {
  router.get('/api/surveys', (req, res, next) => {
    const surveys = Surveys.find({}).fetch();
    // res.writeHead(200);
    res.end(JSON.stringify(surveys));
    next();
  });

  router.get('/api/surveys/:id', (request, response, next) => {
    const survey = Surveys.findOne({_id: request.params.id});
    Meteor.call('survey.expandedObjForApi', request.params.id, true, (error, result) => {
      if (error) {
        response.end(JSON.stringify(error));
        next();
        return;
      }
      response.end(JSON.stringify(result));
      next();
    })
  });
})

WebApp.connectHandlers
  .use(middlewareAPIRedirector);




Meteor.startup(() => {
  // code to run on server at startup

  // publish the logged-in user's surveys only
  Meteor.publish('surveys', function () {
    return Surveys.find({creatorId: this.userId});
  });

  // publish a single survey for the surveyEdit and surveyShow pages
  Meteor.publish('singleSurvey', function (surveyId) {
    return Surveys.find({_id: surveyId});
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







