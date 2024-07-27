import React from 'react'
import './footer.css'

const Footer = () => {
    return (
        <>
        <footer id="footer" className="d-flex">
                <div className="flex-shrink-1 pt-5 px-3">info about our website its good one which you can see ads on</div>
                <div className="row row-cols-1 row-cols-md-3 g-4 w-100">
                    <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                        <h5 className="card-title mb-4">من نحن</h5>
                        <a className="card-text">عن الموقع</a>
                        <a className="card-text">سؤال وجواب</a>
                        <a className="card-text">اتصل بنا</a>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4">من نحن</h5>
                            <a className="card-text">عن الموقع</a>
                            <a className="card-text">سؤال وجواب</a>
                            <a className="card-text">اتصل بنا</a>
                        </div>
                    </div>
                    </div>
                    <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h5 className="card-title mb-4">من نحن</h5>
                            <a className="card-text">عن الموقع</a>
                            <a className="card-text">سؤال وجواب</a>
                            <a className="card-text">اتصل بنا</a>
                        </div>
                    </div>
                    </div>
                </div>
            </footer>
            <div className="bottom d-flex justify-content-center align-items-center bg-dark">all rights res</div>                  
        </>
    )
}

export default Footer
