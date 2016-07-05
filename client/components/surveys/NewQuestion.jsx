import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Modal} from 'react-bootstrap';

export default class NewQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'textResponse',
    }
  }

  handleQuestionTypeClick(e) {
    this.setState({
      type: e.target.value
    })
  }

  handleCancelClick(e) {
    e.preventDefault();
    
  }

  render() {
    return (
        <Modal className="new-question-modal" show={this.props.show}>
          <Modal.Header>
            <h3>Add a New Question</h3>
          </Modal.Header>
          <Modal.Body>
            <h4>Question type:</h4>
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
            Hello!
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default"
              onClick={this.handleCancelClick.bind(this)}>
                Cancel
            </button>
          </Modal.Footer>
        </Modal>
      )
  }
}