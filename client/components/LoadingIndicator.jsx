import React, {Component} from 'react';

export default class LoadingIndicator extends Component {
  constructor(props) {
    super(props);
    this.state = {message: ''}
  }

  componentDidMount() {
    // delay display to avoid quick flashes of loading message
    this.timer = setTimeout(() => {
      this.setState({message: "Loading..."});
    }, 500);
  }

  componentWillUnmount() {
    window.clearTimeout(this.timer);
  }

  render() {
    return (
        <div className="text-info">{this.state.message}</div>
      )
  }
}