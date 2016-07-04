import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import {Surveys} from '../../../imports/collections/surveys';
import {Courses} from '../../../imports/collections/courses';

import NewSurvey from '../surveys/NewSurvey';
import moment from 'moment';

class SurveysList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFilterCourse: 'all', 
      showNewSurveyModal: false,
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
    return this.filteredSurveys().map((survey) => {
      const course = this.props.courses.filter((courseObj) => {
        return courseObj._id === survey.courseId;
      })[0];
      return (
          <div key={survey._id} className="list-group-item">
            <h3>{survey.title}</h3>
            <p className="survey-meta">
              Course: {course.title} (Created {moment(survey.createdAt).format('MM/DD/YY')})
            </p>
          </div>
        )
    })
  }

  render() {
    if (!this.props.currentUser) {
      return (
          <div className="alert alert-info">
            Please Log In
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
          <div className="content-container">
            {this.renderSurveysOuterView()}
          </div>

          <NewSurvey show={this.state.showNewSurveyModal} closeModal={() => {this.setState({showNewSurveyModal: false})}} />

        </div>
      )
  }
}

export default createContainer(() => {
  Meteor.subscribe('surveys');
  Meteor.subscribe('courses');
  return {
    surveys: Surveys.find({}).fetch(),
    courses: Courses.find({}).fetch(),
    currentUser: Meteor.user()
  }
}, SurveysList);