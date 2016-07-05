import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Modal} from 'react-bootstrap';

import {Courses} from '../../../imports/collections/courses';

class NewSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      selectedCourseId: 'none',
      error: null
    }
  }

  handleTitleChange(e) {
    e.preventDefault();
    this.setState({
      title: this.refs.title.value
    });
  }

  handleCourseSelectChange(e) {
    e.preventDefault();
    this.setState({
      selectedCourseId: this.refs.course.value
    });
  }

  handleCloseButtonClick(e) {
    e.preventDefault();
    this.setState({
      title: '',
      selectedCourseId: 'none',
      error: null
    });
    this.props.closeModal();
  }

  handleCreateButtonClick(e) {
    e.preventDefault();
    if (this.state.title == '' || this.state.selectedCourseId == 'none') {
      this.setState({
        error: 'Please complete all fields'
      });
      return;
    }
    Meteor.call('surveys.insert', 
      {courseId: this.state.selectedCourseId, title: this.state.title}, 
      (err, result) => {
        if (err) {
          this.setState({error: 'Save not successful'});
        }
        else {
          this.setState({error: null, title: '', selectedCourseId: 'none'});
          this.props.closeModal();
        }
      }
    );
  }

  renderCourseOptions() {
    return this.props.courses.map((course) => {
      return (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        )
    });
  }

  render() {
    return (
        <Modal show={this.props.show}>
          <Modal.Header>
            <h3>Create a New Survey</h3>
          </Modal.Header>
          <Modal.Body>
            {this.state.error ? <div className="alert alert-warning">{this.state.error}</div> : ''}
            <form id="new-survey-form" onSubmit={this.handleCreateButtonClick.bind(this)}>
              <div className="form-group">
                <label className="control-label">Course</label>
                <select ref="course" 
                  value={this.state.selectedCourseId}
                  className="form-control"
                  onChange={this.handleCourseSelectChange.bind(this)}>
                    <option key={1} value="none" disabled="disabled">Choose a course...</option>
                    {this.renderCourseOptions()}
                </select>
              </div>
              <div className="form-group">
                <label className="control-label">Title</label>
                <input className="form-control" 
                  type="text"
                  value={this.state.title}
                  onChange={this.handleTitleChange.bind(this)}
                  ref="title"
                  placeholder="Title of Survey" />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default"
              onClick={this.handleCloseButtonClick.bind(this)}>
                Close
            </button>
            <button className="btn btn-primary"
              onClick={this.handleCreateButtonClick.bind(this)}>
                Create Survey
            </button>
          </Modal.Footer>
        </Modal>
      )
  }
}

export default createContainer(() => {
  Meteor.subscribe('courses');
  return {
    courses: Courses.find({}).fetch()
  }
}, NewSurvey);