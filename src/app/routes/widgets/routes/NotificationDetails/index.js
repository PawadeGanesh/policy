import React from "react";
import NotificationDetail from "./NotificationDetail";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";




const ModernWidgets = (props) => {
  return (
    <div className="animated slideInUpTiny animation-duration-3">
    <ContainerHeader match={props.match} title={<IntlMessages id="notification.details.title"/>}/>
      <div className="row">
        <div className="col-xl-12 col-sm-12 order-xl-1">
          <NotificationDetail/>

        </div>
              </div>
    </div>
  );
};

export default ModernWidgets;
