import React from "react";
import IntlMessages from 'util/IntlMessages';
import './sucessPageStyle.css'

function App() {
return (
    
    <>
     <div className="app-success-container ">
      <div className="app-success-main-content">
      <div className="app-success-content">
    <div className="page-error-container animated slideInUpTiny animation-duration-3">
    <div className="page-error-content">
      <br/><br/><br/><br/><br/><br/>
      <div className="error-code mb-3 animated zoomInDown"><IntlMessages id="success.message"/></div>
      <h2 className="text-center fw-regular title animated bounceIn animation-delay-10">
      <IntlMessages id="success.submessage"/>
        </h2>
        </div>
        </div>
  </div> 
    </div>
  </div>
    </>
  )
}

export default App;
