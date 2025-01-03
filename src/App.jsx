import React from 'react';
import RainGrid from './components/RainGrid';
import './styles/App.css';

function App() {
  return (
    <div className="app-container">
      <h1>Dynamic Rain Grid Animation</h1>
      <RainGrid rows={15} cols={20} />
    </div>
  );
}

export default App;
