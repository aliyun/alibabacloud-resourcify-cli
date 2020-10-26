import React from 'react';
import Axios from "axios";
import './App.css';
import { SubList } from './component/subList.js'
import { DocContent } from './component/content.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sublist: {},
      activeUrlPath: '',
      contentLevel: ''
    }
  }
  componentWillMount() {
    Axios.get('/product')
      .then(response => {
        this.setState({ sublist: response.data })
      })
      .catch(error => {
        console.log(error)
      })
  }
  render() {
    return (
      <div className="App">
        <div className="list">
        <SubList level="product" sublist={this.state.sublist} onChange={data => {
          this.setState({
            activeUrlPath: data.activeUrlPath,
            contentLevel: data.contentLevel
          })
        }} />
        </div>
        <div className="content">
        <DocContent activeUrlPath={this.state.activeUrlPath} contentLevel={this.state.contentLevel} />
        </div>
      </div>
    );
  }

}

export {
  App
};
