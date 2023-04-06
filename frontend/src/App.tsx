import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Games from "./pages/Games";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="w-full">
      <NavBar />
      <div className="w-full">
        <Routes>
          <Route index element={ <Home /> } />
          <Route path="/auth" element={ <Auth /> } />
          <Route path="/games" element={ <Games /> } />
          <Route path="*" element={ <NotFound /> } />
        </Routes>
      </div>
    </div>
  )
}

export default App
