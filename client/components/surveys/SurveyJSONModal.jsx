import React, {Component} from 'react';
import jsonFormat from 'json-format';
import {Modal} from 'react-bootstrap';
import LoadingIndicator from '../LoadingIndicator';

export default class SurveyJSONModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedObj: {},
      loading: true
    }
  }

  getJSON() {
    Meteor.call('survey.expandedObjForApi', this.props.survey._id, (error, res) => {
      if (error) {
        return;
      }
      this.setState({
        expandedObj: res,
        loading: false
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (!this.props.survey || prevProps === this.props) {
      return;
    }
    this.getJSON();
  }

  renderJSON() {
    return jsonFormat(this.state.expandedObj, {type: 'space', size: 2});
  }

  renderBody() {
    if (this.state.loading) {
      return (
          <LoadingIndicator />
        )
    }
    const apiUrl = `/api/surveys/${this.props.survey._id}`;
    return (
        <div>
          <p>
            <a className="btn btn-info btn-sm" href={apiUrl} target="_blank">
              View API Endpoint <i className="fa fa-external-link" aria-hidden="true"></i>
            </a> ({apiUrl})
          </p>
          <div>
            <pre>
              <samp>
                {this.renderJSON()}
              </samp>
            </pre>
          </div>
        </div>
      )
  }

  render() {
    if (!this.props.survey) {
      return <div />;
    }
    const {survey} = this.props;
    return (
        <Modal bsSize="lg" show={this.props.show}>
          <Modal.Header>
            <h3>JSON Representing Survey "{survey.title}"</h3>
          </Modal.Header>

          <Modal.Body>
            {this.renderBody()}
            
          </Modal.Body>

          <Modal.Footer>
            <button className="btn btn-primary" onClick={this.props.closeModal}>
              Close
            </button>
          </Modal.Footer>
        </Modal>
      )

  }
}