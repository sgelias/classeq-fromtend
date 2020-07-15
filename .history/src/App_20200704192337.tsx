import React from 'react';
import './App.css';
import Navbar from './screens/App/shared/components/Navbar/components/Navbar';

function App() {
  return (
    <div className="App">
      <Navbar
        toogleSidebar={ true }
      />
    </div>
  );
}

export default App;
