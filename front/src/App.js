import './App.css';
import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Exports from './components/export/export';


const {Nav,About,Faq,Show,Register,Verify,Verified,Login,RequestReset,Forgetpassword,Profile,Add,Dashboard,SuccessPay
  ,SuccessPayExternal,CancelPay,Footer}=Exports;

function App() {
  return (
    <div className="App">
        <Nav/>
          <Routes>
            <Route path="/about"              element={<About/>} />
            <Route path="/faq"                element={<Faq/>} />
            <Route path="/"                   element={<Show/>} />
            <Route path="*"                   element={<Show/>} />
            <Route path="/register"           element={<Register/>} />
            <Route path="/verify"             element={<Verify/>} />
            <Route path="/verified"           element={<Verified/>} />
            <Route path="/login"              element={<Login/>} />
            <Route path="/password-reset"     element={<RequestReset/>} />
            <Route path="/forget-password"         element={<Forgetpassword/>} />
            <Route path="/success-pay"             element={<SuccessPay/>} />
            <Route path="/success-pay-external"    element={<SuccessPayExternal/>} />
            <Route path="/add"                     element={<Add/>} />
            <Route path="/dashboard/*"             element={<Dashboard/>} />

            <Route path="/profile/*"              element={<Profile/>} />

          </Routes>
        <Footer/>
    </div>
  );
}

export default App;
