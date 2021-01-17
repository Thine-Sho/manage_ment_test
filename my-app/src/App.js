import React from 'react';
import './App.css';

import SpreadSheetHandler from './spreadsheet.js';

class App extends React.Component {
  constructor(props)
   {
    super(props);
  }

  render()
  {
    return(<SpreadSheetHandler />);
  }
}

export default App;
