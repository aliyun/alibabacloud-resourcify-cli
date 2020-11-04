import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import AppContent from './pages';
// import { DocContent } from './component/content.js';
// import { SubList } from './component/subList.js';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <HashRouter basename='/'>
      <Route path={`/`} component={AppContent} />
    </HashRouter>
  );
};

export default App;

// class App extends React.Component {
//   state = {
//     sublist: {},
//     activeUrlPath: '',
//     contentLevel: '',
//   };

//   componentWillMount() {
//     Axios.get('/product')
//       .then((response) => {
//         this.setState({ sublist: response.data });
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }
//   render() {
//     return (
//       <div className='App'>
//         <div className='list'>
//           <SubList
//             level='product'
//             sublist={this.state.sublist}
//             onChange={(data) => {
//               this.setState({
//                 activeUrlPath: data.activeUrlPath,
//                 contentLevel: data.contentLevel,
//               });
//             }}
//           />
//         </div>
//         <div className='content'>
//           <DocContent
//             activeUrlPath={this.state.activeUrlPath}
//             contentLevel={this.state.contentLevel}
//           />
//         </div>
//       </div>
//     );
//   }
// }

// export default App;
