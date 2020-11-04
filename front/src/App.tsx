import React from 'react';
import { HashRouter, Route } from 'react-router-dom';
import './App.css';
import AppContent from './pages';

export interface AppProps {}

const App: React.FC<AppProps> = () => {
  return (
    <HashRouter basename='/'>
      <Route path={`/`} component={AppContent} />
    </HashRouter>
  );
};

export default App;
