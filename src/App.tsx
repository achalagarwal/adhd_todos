import Todos from './Todos';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {
    
  return (

    <Router basename="/app">
    <div>
    

      {/*
        A <Switch> looks through all its children <Route>
        elements and renders the first one whose path
        matches the current URL. Use a <Switch> any time
        you have multiple routes, but you want only one
        of them to render at a time
      */}
      <Routes>
        <Route path="/" element={<>
        
          <ul>

        <li>
          <Link to="/todos">Todos</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>

      <hr />
        </>}>
        </Route>
        <Route path="/todos" element={<Todos />}>
        </Route>
        <Route path="/dashboard" element={<Todos />}>
        </Route>
      </Routes>
    </div>
  </Router>

  );
}

export default App;
