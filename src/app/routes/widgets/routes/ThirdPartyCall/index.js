
import React from "react";
import ThirdPartyCall from "./ThirdPartyCall";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";

const ModernWidgets = (props) => {
  if (props.match.path==="/app/widgets/ThirdPartyCall") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="ThirdPartyCall.master.title" />}/>
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <ThirdPartyCall currentBaseUrl="/insurance/enquiry"/>
          </div>
        </div>
      </div>
    );
  }
  
};

export default ModernWidgets;
