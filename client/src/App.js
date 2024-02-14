import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/navbar';
import Home from './components/home';
import CreateAccount from './components/createaccount';
import Login from './components/login';
import Deposit from './components/deposit';
import Withdraw from './components/withdraw';
import Contact from './components/contact';
import Description from './components/description';
import Allusers from './components/allusers';

import { AppContextProvider } from './context';

function App() {

  return (
    <>
      <AppContextProvider>
        <Router>
          <NavBar/>
          <Routes>
            <Route path="/" exact element={ <Home/> } />
            
            <Route path="/register/" exact element={ <CreateAccount/> } />
            <Route path="/login/" exact element={ <Login/> } />
            <Route path="/contact/" exact element={ <Contact/> } />
            <Route path="/deposit/" exact element={ <Deposit/> } />
            <Route path="/withdraw/" exact element={ <Withdraw/> } />
            <Route path="/description/" exact element={ <Description/> } />
            <Route path="/allusers/" exact element={ <Allusers/> } />

          </Routes>
        </Router>
      </AppContextProvider>
    </>
  )
}

export default App;
