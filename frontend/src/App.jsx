import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Stats from './pages/Stats';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            ホーム
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
            履歴
          </NavLink>
          <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>
            統計
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
            設定
          </NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
