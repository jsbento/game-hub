import { Routes, Route } from 'react-router-dom';

import NavBar from './components/NavBar';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Games from './pages/Games';
import Profile from './pages/users/Profile';
import NotFound from './pages/NotFound';
import ConnectFour from './pages/games/ConnectFour';

function App() {
  return (
    <div className="w-full">
      <NavBar />
      <div className="w-full">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/connect-four" element={<ConnectFour />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
