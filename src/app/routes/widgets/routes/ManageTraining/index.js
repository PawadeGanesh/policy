
import React from "react";
import ManageTraining from "./ManageTraining";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";

const ModernWidgets = (props) => {
  if (props.match.path==="/app/widgets/ManageTraining") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="ManageTraining.title"/>}
         />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <ManageTraining currentBaseUrl="/otm/courses"/>
          </div>
        </div>
      </div>
    );
  }
};

export default ModernWidgets;
