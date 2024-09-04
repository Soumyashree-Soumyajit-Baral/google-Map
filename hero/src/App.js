import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


import Calculator from './Component/calculator/calculator';
import Map from './Component/map/map';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Calculator />} />

        {/* Other routes */}
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/map" element={<Map />} />
        {/* <Route path="/service" element={<Service />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
