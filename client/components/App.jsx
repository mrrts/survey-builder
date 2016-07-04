import React, {Component} from 'react';
import Navbar from './Navbar';

class App extends Component {
  render() {
    return (
        <div>
          <Navbar />
          <main className="container">
            {this.props.children}
          </main>
        </div>
      )
  }
}

export default App;