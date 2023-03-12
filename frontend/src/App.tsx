import { BrowserRouter, Route } from "react-router-dom";

import Login from "./pages/Login";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Route path="/auth" element={ <Login /> }/>
      </BrowserRouter>
    </div>
  )
}

export default App
