import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Modal} from 'react-bootstrap';


export default class NewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'textResponse',
      textResponseData: {
        responseType: 'shortText',
      },
      multipleChoiceData: {
        choices: [''],
      },
      question: ''
    }
  }

  handleQuestionTypeClick(e) {
    this.setState({
      type: e.target.value
    })
  }

  handleCancelClick(e) {
    e.preventDefault();
    this.props.closeModal();
    this.setState({
      type: 'textResponse',
      question: '',
      multipleChoiceData: {
        choices: ['']
      }
    });
  }

  handleSaveQuestionClick(e) {
    e.preventDefault();
    var questionObj = this.cloneOfState();
    const index = this.props.editingQuestion;
    if (index !== false) {
      // We are in Edit mode
      this.props.updateQuestion(index, this.state);
    }
    else {
      // We are creating a new question
      this.props.addQuestion(questionObj);
    }
    this.setState({
      type: 'textResponse',
      question: '',
      multipleChoiceData: {
        choices: ['']
      }
    });
    this.props.resetEditing();
    this.props.closeModal();
  }

  handleQuestionChange(e) {
    e.preventDefault();
    const question = e.target.value
    this.setState({
      question,
    });
  }

  handleTextResponseTypeRadioClick(e) {
    var textResponseData = this.state.textResponseData;
    textResponseData.responseType = e.target.value;
    this.setState({ textResponseData });
  }

  handleModalEntered(e) {
    if (this.props.editingQuestion !== false) {
      this.setState(this.props.questions[this.props.editingQuestion]);
    }
  }

  textResponseFields() {
    const responseType = this.state.textResponseData.responseType;
    return (
        <div>
          <div className="form-group">
            <label className="control-label">Response Type</label>
            <div className="radio">
              <label>
                <input type="radio" value="shortText" readOnly 
                  checked={responseType === 'shortText'}
                  onClick={this.handleTextResponseTypeRadioClick.bind(this)} />
                Short response, single-line text field
              </label>
            </div>
            <div className="radio">
              <label>
                <input type="radio" value="longText" readOnly
                  checked={responseType === 'longText'}
                  onClick={this.handleTextResponseTypeRadioClick.bind(this)} />
                Longer response, multi-line text field
              </label>
            </div>
          </div>
        </div>
      )
  }


  cloneOfState() {
    //only works if none of the items stored in this.state are functions
    return JSON.parse(JSON.stringify(this.state));
  }


  addEmptyChoice(e) {
    e.preventDefault();
    var cloneOfState = this.cloneOfState();
    cloneOfState.multipleChoiceData.choices.push('');
    this.setState(cloneOfState);
  }

  removeChoice(e, index) {
    e.preventDefault();
    var cloneOfState = this.cloneOfState();
    cloneOfState.multipleChoiceData.choices.splice(index, 1);
    this.setState(cloneOfState); 
  }

  updateChoice(e, index) {
    var cloneOfState = this.cloneOfState();
    cloneOfState.multipleChoiceData.choices[index] = e.target.value;
    this.setState(cloneOfState);
  }

  multipleChoiceFields() {
    const {multipleChoiceData} = this.state;
    const numChoices = multipleChoiceData.choices.length;
    const choiceInputFields = multipleChoiceData.choices.map((choice, i) => {
      return (
          <div key={i} className="form-group">
            <label className="control-label">
              Choice #{i + 1}: &nbsp;
              {numChoices == 1 ? '' : 
                (<a className="text-danger" onClick={(e) => {this.removeChoice(e, i)}}>
                   <i className="fa fa-times-circle" aria-hidden="true"></i>
                </a>)
              }
            </label>
            <input className="form-control" type="text" value={multipleChoiceData.choices[i]}
              onChange={(e) => {this.updateChoice(e, i)}} />
          </div>
        )
    })
    return (
        <div>
          {choiceInputFields}
          <button className="btn btn-primary btn-xs"
            onClick={this.addEmptyChoice.bind(this)}>
            Add Another Choice
          </button>
        </div>
      )
  }

  renderQuestionFormFields() {
    switch (this.state.type) {
      case "textResponse":
        return this.textResponseFields();
      case "multipleChoice":
        return this.multipleChoiceFields();
      case "ratingSlider":
        return (
            <div />
          );
    }
  }

  render() {
    return (
        <Modal className="new-question-modal" bsSize="lg" onEntered={this.handleModalEntered.bind(this)} show={this.props.show}>
          <Modal.Header>
            <h3>{this.props.editingQuestion !== false ? "Edit" : "Add a New"} Question</h3>
          </Modal.Header>
          <Modal.Body>
            <h4><strong>Question type:</strong></h4>
            <form className="well">
              <label className="radio-inline">
                <input type="radio" value="textResponse" 
                  checked={this.state.type == 'textResponse'} readOnly
                  onClick={this.handleQuestionTypeClick.bind(this)} /> Text Response
              </label>
              <label className="radio-inline">
                <input type="radio" value="multipleChoice"
                  checked={this.state.type == 'multipleChoice'} readOnly
                  onClick={this.handleQuestionTypeClick.bind(this)} /> Multiple Choice
              </label>
              <label className="radio-inline">
                <input type="radio" value="ratingSlider"
                  checked={this.state.type == 'ratingSlider'} readOnly disabled
                  onClick={this.handleQuestionTypeClick.bind(this)} /> Rating Slider (Coming Soon)
              </label>
            </form>
            <form>
              <div className="form-group">
                <label className="control-label">Question</label>
                <input type="text" placeholder="Question" 
                  value={this.state.question} 
                  className="form-control"
                  onChange={this.handleQuestionChange.bind(this)} />
              </div>
              {this.renderQuestionFormFields()}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default"
              onClick={this.handleCancelClick.bind(this)}>
                Cancel
            </button>
            <button className="btn btn-primary"
              onClick={this.handleSaveQuestionClick.bind(this)}>
                Save Question
            </button>
          </Modal.Footer>
        </Modal>
      )
  }
}