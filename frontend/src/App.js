import React, { Component } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/MainComponent';
import { TODOS } from './shared/data';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      // email: this.props.email,
      todos: TODOS
    };
  }

  componentWillMount() {

  }


  render() {
    return (
      <BrowserRouter>
        <div>
          <Main todos={this.state.todos} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;