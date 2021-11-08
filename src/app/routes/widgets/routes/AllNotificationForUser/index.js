/* eslint-disable react/prop-types */

import React from "react";
import AllNotificationForUser from "./AllNotificationForUser";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";
 // import ListOfPolicies from "app/routes/widgets/routes/ListOfPolicies/ListOfPolicies";




const ModernWidgets = (props) => {
  return (
    <div className="animated slideInUpTiny animation-duration-3">
    <ContainerHeader match={props.match} title={<IntlMessages id="AllNotificationForUser.master.title"/>}/>
      <div className="row">
        <div className="col-xl-12 col-sm-12 order-xl-1">
          <AllNotificationForUser/>

        </div>
              </div>
    </div>
  );
};

export default ModernWidgets;
