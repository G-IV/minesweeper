import React from 'react';
import './App.css';

import Minefield from './features/minefield/Minefield'
import Controls from './features/controls/Controls'

function App() {
  return (
    <div className="App">
      <div>
        <Controls />
      </div>
      <div>
        <Minefield />
      </div>
    </div>
  );
}

export default App;
