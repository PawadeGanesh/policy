
import React from "react";
import ListOfPolicies from "./ListOfPolicies";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";


const ModernWidgets = (props) => {
  if (props.match.path === "/app/widgets/ListOfPolicies") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="ListOfPolicies.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <ListOfPolicies currentBaseUrl="/insurance/policy" />
        </div>
        </div>
      </div>
    );
  }
  else if (props.match.path === "/app/widgets/MyPolicies") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="MyPolicies.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <ListOfPolicies currentBaseUrl="/insurance/my/policies"/>
          </div>
        </div>
      </div>
    );
  }
};

export default ModernWidgets;
