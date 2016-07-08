import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';
import bootstrapConfirm from 'bootstrap-confirm';

import {Surveys} from '../../../imports/collections/surveys';
import {Courses} from '../../../imports/collections/courses';

import NewSurvey from './NewSurvey';
import LoadingIndicator from '../LoadingIndicator';
import Login from '../Login';
import SurveyJSONModal from './SurveyJSONModal';
import TestDriveModal from './TestDriveModal';
import moment from 'moment';

class SurveysList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterCourse: 'all', 
      showNewSurveyModal: false,
      showSurveyJSONModal: false,
      showTestDriveModal: false,
      surveyIndexForJSONModal: null,
      surveyIndexForTestDriveModal: null,
    }
  }

  renderCourseSelectOptions() {
    return this.props.courses.map((course) => {
      return (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        )
    })
  }

  filteredSurveys() {
    var filteredSurveys = this.props.surveys;
    if (this.state.selectedFilterCourse !== 'all') {
      filteredSurveys = this.props.surveys.filter((survey) => {
        return survey.courseId === this.state.selectedFilterCourse
      })
    }
    return filteredSurveys;
  }

  handleSelectFilterCourseChange(e) {
    e.preventDefault();
    // Update survey list to show only those belonging to selected course
    // Default to full list
    
    this.setState({
      selectedFilterCourse: e.target.value,
    })
  }

  handleDeleteClick(e, surveyId, surveyTitle) {
    e.preventDefault();
    bootstrapConfirm(`Are you sure you want to delete "${surveyTitle}"?`, (confirmed) => {
      if (confirmed) {
        Meteor.call('survey.remove', surveyId);
      }
    });
  }

  handleJSONButtonClick(e, i) {
    e.preventDefault();
    this.setState({
      showSurveyJSONModal: true,
      surveyIndexForJSONModal: i
    })
  }

  handleTestDriveClick(e, i) {
    e.preventDefault();
    this.setState({
      showTestDriveModal: true,
      surveyIndexForTestDriveModal: i
    });
  }

  renderSurveysOuterView() {
    if (this.filteredSurveys().length === 0) {
      return (
          <div className="alert text-info">
            No surveys found.
          </div>
        )
    }
    else {
      return (
          <div className="list-group">
            {this.renderSurveys()}
          </div>
        )
    }
  }

  renderSurveys() {
    if (this.props.loading) {
      return '';
    }
    return this.filteredSurveys().map((survey, i) => {
      const course = this.props.courses.filter((courseObj) => {
        return courseObj._id === survey.courseId;
      })[0];
      const courseTitle = course ? course.title : '';
      return (
          <div key={survey._id} className="list-group-item">
            <span className="course-title-label label label-default">{courseTitle}</span> 
            <h3 className="survey-title"> {survey.title}</h3>
            <div className="clearfix" />
            <p className="survey-meta pull-left">
              <strong>{survey.questions.length}</strong> Question{survey.questions.length == 1 ? '' : 's'} | 
              Created {moment(survey.createdAt).format('MM/DD/YYYY')}
            </p>
            <div className="pull-right survey-list-item-actions">
              <button className="btn btn-success btn-xs"
                title="Test Drive this Survey"
                onClick={(e) => {this.handleTestDriveClick(e, i)}}
                >
                  <i className="fa fa-play-circle" aria-hidden="true"></i> Test Drive
              </button>
              <button className="btn btn-primary btn-xs"
                title="Get JSON"
                onClick={(e) => {this.handleJSONButtonClick(e, i)}}
                >
                  <i className="fa fa-exchange" aria-hidden="true"></i> JSON
              </button>
              <Link className="btn btn-info btn-xs"
                to={`/surveys/${survey._id}/edit`}
                title="Edit">
                  <i className="fa fa-pencil" aria-hidden="true"></i> Edit
              </Link>
              <button className="btn btn-danger btn-xs"
                onClick={(e) => {this.handleDeleteClick(e, survey._id, survey.title)}}
                title="Delete">
                  <i className="fa fa-trash" aria-hidden="true"></i> Delete
              </button>
            </div>
            <div className="clearfix" />
          </div>
        )
    })
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator />
    }

    if (!this.props.currentUser) {
      return (
          <div>
            <div className="alert alert-info">
              Please Log In
            </div>
            <Login />
          </div>
        )
    }
    return (
        <div id="surveys-list">
          <h2>My Surveys</h2>
          <form className="form-inline pull-left">
            <div className="form-group">
              <label htmlFor="course">Show Surveys for</label>
              <select onChange={this.handleSelectFilterCourseChange.bind(this)} 
                className="form-control"
                name="course" 
                value={this.state.selectedFilterCourse}>
                  <option key={1} value="all">All courses</option>
                  {this.renderCourseSelectOptions()}
              </select>
            </div>
          </form>
          <button className="pull-right btn btn-primary"
            onClick={() => {this.setState({showNewSurveyModal: true})}}>
              <i className="fa fa-plus" aria-hidden="true"></i> Add a Survey
          </button>
          <div className="clearfix" />
          <div className="content-container col-lg-10 col-lg-push-1">
            {this.renderSurveysOuterView()}
          </div>

          <NewSurvey show={this.state.showNewSurveyModal} closeModal={() => {this.setState({showNewSurveyModal: false})}} />

          <SurveyJSONModal show={this.state.showSurveyJSONModal} closeModal={() => {this.setState({showSurveyJSONModal: false})}} survey={this.props.surveys[this.state.surveyIndexForJSONModal]} />

          <TestDriveModal show={this.state.showTestDriveModal} closeModal={() => {this.setState({ showTestDriveModal: false})}} survey={this.props.surveys[this.state.surveyIndexForTestDriveModal]} />
          

        </div>
      )
  }
}

export default createContainer(() => {
  const surveysHandler = Meteor.subscribe('surveys');
  const coursesHandler = Meteor.subscribe('courses');
  const loading = !surveysHandler.ready() && !coursesHandler.ready();
  return {
    surveys: Surveys.find({}, {sort: {createdAt: -1}}).fetch(),
    courses: Courses.find({}).fetch(),
    currentUser: Meteor.user(),
    loading
  }
}, SurveysList);