
import React from "react";
import MyTraining from "./MyTraining";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";

const ModernWidgets = (props) => {
  if (props.match.path==="/app/widgets/MyTraining") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="MyTrainings.master.title" />}
         />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <MyTraining currentBaseUrl="/otm/my/trainings"/>
          </div>
        </div>
      </div>
    );
  }
};

export default ModernWidgets;
