import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import {RadioGroup, Radio} from 'react-radio-group';
import jsonFormat from 'json-format';

export default class TestDriveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      responses: {},
      surveyLoaded: false,
      viewResponses: false,
    }
  }

  componentDidUpdate() {
    if (this.state.surveyLoaded) {
      return;
    }
    if (this.props.survey) {
      var responseObj = {};
      this.props.survey.questions.forEach((question) => {
        responseObj[question.question] = "";
      });
      this.setState({
        responses: responseObj,
        surveyLoaded: true
      });
    }
  }

  clonedResponseObj() {
    return JSON.parse(JSON.stringify(this.state.responses));
  }

  handleResponseChange(e, inputRef) {
    var clonedResponseObj = this.clonedResponseObj();
    clonedResponseObj[inputRef] = e.target.value;
    this.setState({
      responses: clonedResponseObj
    });
  }

  handleRadioChange(inputRef, value) {
    var clonedResponseObj = this.clonedResponseObj();
    clonedResponseObj[inputRef] = value;
    this.setState({
      responses: clonedResponseObj
    });
  }

  textResponseField(question) {
    switch (question.textResponseData.responseType) {
      case "shortText":
        return (
            <input value={this.state.responses[question.question]} onChange={(e) => {this.handleResponseChange(e, question.question)}} type="text" className="form-control" ref={question.question} />
          );
      case "longText":
        return (
            <textarea value={this.state.responses[question.question]} onChange={(e) => {this.handleResponseChange(e, question.question)}} className="form-control" ref={question.question}></textarea>
          )
    }
  }

  renderChoices(question) {
    if (question.multipleChoiceData.choices.length === 0 ) {
      return;
    }
    return question.multipleChoiceData.choices.map((choice, i) => {
      return (
          <div className="radio">
            <label>
              <Radio key={i} value={choice} /> {choice}
            </label>
          </div>
        )
    })
  }

  multipleChoiceField(question) {
    return (
        <RadioGroup selectedValue={this.state.responses[question.question]} name={question.question} onChange={this.handleRadioChange.bind(this, question.question)}>
          {this.renderChoices(question)}
        </RadioGroup>
      )
  }

  toggleResponseView(e) {
    e.preventDefault();
    const currentState = this.state.viewResponses
    this.setState({
      viewResponses: !currentState
    })
  }

  renderResponses() {
    return (
        <div>
          <pre>
            <samp>
              {jsonFormat(this.state.responses, {type: 'space', size: 2})}
            </samp>
          </pre>
        </div>
      )
  }

  renderQuestions() {
    const {survey} = this.props;
    return survey.questions.map((question) => {
      var formField;
      switch(question.type) {
        case "textResponse":
          formField = this.textResponseField(question);
          break;
        case "multipleChoice":
          formField = this.multipleChoiceField(question);
          break;
      }
      return (
          <div className="form-group">
            <label className="control-label">{question.question}</label>
            {formField}
          </div>
        )
    });
  }

  render() {
    if (!this.props.survey) {
      return <div />
    }
    const {survey} = this.props;
    return (
        <Modal show={this.props.show}>
          <Modal.Header>
            <h3>Test Drive "{survey.title}"</h3>
          </Modal.Header>
          <Modal.Body>
            {this.state.viewResponses ? this.renderResponses() : (
              <form onSubmit={(e) => {e.preventDefault()}}>
                {this.renderQuestions()}
              </form>
            )}
            <button 
              className="btn btn-info pull-right"
              onClick={this.toggleResponseView.bind(this)}>
                {this.state.viewResponses ? "Back to Survey" : "View Responses"}
            </button>
            <div className="clearfix" />
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-primary"
              onClick={(e)=>{e.preventDefault(); this.props.closeModal()}}>
                Close 
            </button>
          </Modal.Footer>
        </Modal>
      )
  }
}