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
      type: 'textResponse'
    })
  }

  handleAddQuestionClick(e) {
    e.preventDefault();
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

  addEmptyChoice(e) {
    e.preventDefault();
    var cloneOfMultipleChoiceData = JSON.parse(JSON.stringify(this.state.multipleChoiceData));
    cloneOfMultipleChoiceData.choices.push('');
    this.setState({
      multipleChoiceData: cloneOfMultipleChoiceData
    });
  }

  removeChoice(e, index) {
    e.preventDefault();
    var cloneOfMultipleChoiceData = JSON.parse(JSON.stringify(this.state.multipleChoiceData));
    cloneOfMultipleChoiceData.choices.splice(index, 1);
    this.setState({
      multipleChoiceData: cloneOfMultipleChoiceData
    }); 
  }

  updateChoice(e, index) {
    var cloneOfMultipleChoiceData = JSON.parse(JSON.stringify(this.state.multipleChoiceData));
    cloneOfMultipleChoiceData.choices[index] = e.target.value;
    this.setState({ multipleChoiceData: cloneOfMultipleChoiceData });
  }

  multipleChoiceFields() {
    const {multipleChoiceData} = this.state;
    const choiceInputFields = multipleChoiceData.choices.map((choice, i) => {
      return (
          <div key={i} className="form-group">
            <label className="control-label">
              Choice #{i + 1}: &nbsp;
              <a className="text-danger" onClick={(e) => {this.removeChoice(e, i)}}>
                   <i className="fa fa-times-circle" aria-hidden="true"></i>
              </a>
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
        <Modal className="new-question-modal" show={this.props.show}>
          <Modal.Header>
            <h3>Add a New Question</h3>
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
                  checked={this.state.type == 'ratingSlider'} readOnly
                  onClick={this.handleQuestionTypeClick.bind(this)} /> Rating Slider
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
              onClick={this.handleAddQuestionClick.bind(this)}>
                Add Question
            </button>
          </Modal.Footer>
        </Modal>
      )
  }
}