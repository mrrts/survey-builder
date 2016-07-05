import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Surveys} from '../../../imports/collections/surveys';
import {Courses} from '../../../imports/collections/courses';
import LoadingIndicator from '../LoadingIndicator';
import NewQuestion from '../surveys/NewQuestion';
import bootstrapConfirm from 'bootstrap-confirm';
import {browserHistory} from 'react-router';

class EditSurvey extends Component {
  constructor(props) {
    super(props);
    this.state = {title: '', questions: [], courseId: '', receivedFromDB: false, error: null, showNewQuestionModal: false}
  }

  componentDidUpdate() {
    if (!this.state.receivedFromDB && this.props.survey.title) {
      this.setState({
        title: this.props.survey.title,
        courseId: this.props.survey.courseId,
        questions: this.props.survey.questions,
        receivedFromDB: true
      });
    }
  }

  handleTitleInputChange(e) {
    e.preventDefault();
    this.setState({
      title: this.refs.title.value
    });
  }

  handleDeleteButtonClick(e) {
    e.preventDefault();
    bootstrapConfirm(`Are you sure you want to delete the survey "${this.props.survey.title}"?`, (confirm) => {
      if (confirm) {
        Meteor.call('survey.remove', this.props.survey._id);
        browserHistory.push('/');
      }
    });
  }

  handleSaveButtonClick(e) {
    e.preventDefault();
    const surveyId = this.props.survey._id;
    const {courseId, title, questions} = this.state;
    Meteor.call('survey.update', {
      surveyId,
      courseId,
      title,
      questions
    }, (err, result) => {
      if (err) {
        this.setState({error: err.reason});
      }
      else {
        this.setState({error: null});
        browserHistory.push('/');
      }
    });
  }

  handleSelectCourseChange(e) {
    e.preventDefault();
    this.setState({
      courseId: e.target.value
    });
  }

  handleNewQuestionClick(e) {
    e.preventDefault();
    this.setState({
      showNewQuestionModal: true
    });
  }

  renderQuestions() {
    return;
  }

  renderCourseSelectOptions() {
    return this.props.courses.map((course) => {
      return (
          <option key={course._id} value={course._id}>
            {course.title}
          </option>
        )
    });
  }

  render() {
    if (this.props.loading) {
      return <LoadingIndicator />
    }
    return (
        <div>
          <h2>Edit Survey</h2>
          <div className="survey-edit-actions">
            <button className="btn btn-default btn-xs"
              onClick={() => {browserHistory.push('/')}}>
                <i className="fa fa-ban" aria-hidden="true"></i> Cancel
            </button>
            <button className="btn btn-success btn-xs"
              onClick={this.handleSaveButtonClick.bind(this)}>
                <i className="fa fa-check-circle" aria-hidden="true"></i> Save Changes
            </button>
            <button className="btn btn-danger btn-xs"
              onClick={this.handleDeleteButtonClick.bind(this)}>
                <i className="fa fa-trash" aria-hidden="true"></i> Delete Survey
            </button>
          </div>
          <div className="content-container">
            <form className="form-horizontal">
              <div className="form-group">
                <label className="col-sm-2 col-md-1 control-label">Course</label>
                <div className="col-sm-10 col-md-11">
                  <select className="form-control" ref="course" value={this.state.courseId}
                    onChange={this.handleSelectCourseChange.bind(this)}>
                    {this.renderCourseSelectOptions()}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="col-sm-2 col-md-1 control-label">Title</label>
                <div className="col-sm-10 col-md-11">
                  <input className="form-control"
                    type="text"
                    ref="title" name="title"
                    onChange={this.handleTitleInputChange.bind(this)}
                    value={this.state.title} />
                </div>  
              </div>
              <div className="form-group">
                <label className="col-sm-2 col-md-1 control-label">Questions</label>
                <div className="col-sm-10 col-md-11">
                  {this.renderQuestions()}
                  <button className="btn btn-primary"
                    onClick={this.handleNewQuestionClick.bind(this)}>
                      <i className="fa fa-plus" aria-hidden="true"></i> Add a Question
                  </button>
                </div>
              </div>
            </form>
          </div>

          <NewQuestion show={this.state.showNewQuestionModal} />

        </div>
      )
  }
}

export default createContainer(({params}) => {
  const surveyHandle = Meteor.subscribe('singleSurvey', params.surveyId);
  const coursesHandle = Meteor.subscribe('courses');
  const loading = !surveyHandle.ready() || !coursesHandle.ready();
  return {
    survey: Surveys.findOne(params.surveyId),
    courses: Courses.find({}).fetch(),
    loading
  }
}, EditSurvey);