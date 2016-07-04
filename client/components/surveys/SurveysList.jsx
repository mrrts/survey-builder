import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Link} from 'react-router';

import {Surveys} from '../../../imports/collections/surveys';
import {Courses} from '../../../imports/collections/courses';

class SurveysList extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedFilterCourse: 'all', filteredSurveys: props.surveys}
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

  handleSelectFilterCourseChange(e) {
    e.preventDefault();
    // Update survey list to show only those belonging to selected course
    // Default to full list
    const newFilteredSurveys = this.props.surveys;
    if (this.state.selectedCourse !== 'all') {
      newFilteredCourses = this.props.surveys.filter((survey) => {
        return survey.courseId === this.state.selectedCourse
      })
    }
    this.setState({
      selectedCourse: e.target.value,
      filteredSurveys: newFilteredSurveys
    })
  }

  renderSurveysOuterView() {
    if (this.state.filteredSurveys.length === 0) {
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
    return this.state.filteredSurveys.map((survey) => {
      return (
          <div key={survey._id} className="list-group-item">

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
          <Link to="/surveys/new" className="pull-right btn btn-primary">
              <i className="fa fa-plus" aria-hidden="true"></i> Add a Survey
          </Link>
          <div className="clearfix" />
          <div className="content-container">
            {this.renderSurveysOuterView()}
          </div>
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