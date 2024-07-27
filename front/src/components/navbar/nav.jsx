import React from 'react';
import {Link} from 'react-router-dom';
import  './nav.css';

const Nav = () => {
    const loginData=JSON.parse(localStorage.getItem('loginData'));
    return (
     
            <nav className="navbar fixed-top navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand" href="#">
                            <i className="bi bi-signpost-2-fill d-inline-block fs-1"></i>
                            <span className="d-inline-block me-2 fs-1 ">لافتة</span>
                        </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse left" id="navbarNav">
                        <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page" >الرئيسية</Link>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">عن الموقع</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">سؤال وجواب</a>
                        </li>
                        <li className="nav-item">
                            <Link to='/add' className="nav-link ">أضف لافتة مجانا</Link>
                        </li>
                        
                        {
                            loginData ? 
                            (<li className="nav-item">
                               <Link to='/profile' className="nav-link ">  حسابي</Link>
                            </li>) 
                             :
                            (<li className="nav-item">
                               <Link to='/login' className="nav-link ">  دخول</Link>
                            </li>)
                        }
                        
                        
                        </ul>
                    </div>
                    </div>
                </nav>
                
       
    )
}

export default Nav
