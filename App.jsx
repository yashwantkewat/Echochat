// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './component/signup';
import Signin from './component/signin';
import Home from './component/Home';
import ForgetPassword from './component/Forgetpassword';
import ResetPassword from './component/ResetPassword';
import Chat from './pages/Chat';
import "./App.css"
function App() {
  return (
    <Router>        
      <div className="App">
        <Routes>
          <Route path="/" element={<SignUp />} /> 
          <Route path="/home" element={<Home />} /> 
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Signin />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/chat-us" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
