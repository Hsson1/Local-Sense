import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ExperiencePage from './pages/ExperiencePage';
import HostDashboard from './pages/HostDashboard';
import './App.css';

function App(){
  return (
    <BrowserRouter>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>Local Sense</h1>
            <p>اكتشف تجارب محلية أصيلة ومؤمّنة</p>
          </div>
        </header>
        
        <nav className="nav">
          <div className="container">
            <ul>
              <li><Link to="/">الرئيسية</Link></li>
              <li><Link to="/host">لوحة المضيف</Link></li>
            </ul>
          </div>
        </nav>

        <main className="container">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/experience/:id" element={<ExperiencePage/>} />
            <Route path="/host" element={<HostDashboard/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;
