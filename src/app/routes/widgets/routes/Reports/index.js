import React from "react";
import Reports from "./Reports";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";
import "./report.css"

const ModernWidgets = (props) => {
const queryParams = new URLSearchParams(window.location.search);
const key = queryParams.get('key');
return (
    <div>
      {/* <div className="row Reportbody" >
        <div className="col-xl-12 col-sm-12 order-xl-1"> */}
          <Reports  currentKey ={key}/>
        {/* </div>
      </div> */}
    </div>
  );
};

export default ModernWidgets;
