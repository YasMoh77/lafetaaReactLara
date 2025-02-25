import { Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';//with Popper.js
import 'bootstrap-icons/font/bootstrap-icons.css';
import Exports from './components/export/export';
import './App.css';



const {Nav,About,Faq,More,Show,Register,Verify,Verified,Login,RequestReset,Forgetpassword,Profile,Add,Dashboard,SuccessPay
  ,SuccessPayExternal,CancelPay,Footer}=Exports;

function App() {
  return (
    <div className="App">
        <Nav/>
          <Routes>
            <Route path="/about"              element={<About/>} />
            <Route path="/faq"                element={<Faq/>} />
            <Route path="/more"                element={<More/>} />
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

