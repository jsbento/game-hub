import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="w-full">
      <NavBar />
      <div className="w-full">
        <Routes>
          <Route index element={ <Home /> } />
          <Route path="/auth" element={ <Login /> } />
          <Route path="*" element={ <NotFound /> } />
        </Routes>
      </div>
    </div>
  )
}

export default App
