/* eslint-disable react/prop-types */
import React from "react";
import AgentList from "./AgentList";
import ContainerHeader from "components/ContainerHeader";
// import IntlMessages from "util/IntlMessages";

const ModernWidgets = (props) => {
  return (
    <div className="animated slideInUpTiny animation-duration-3">
      <ContainerHeader
        match={props.match}
        // title={<IntlMessages id="audit.events.title" />}
        title="Agent List"
      />
      <div className="row">
        <div className="col-xl-12 col-sm-12 order-xl-1">
          <AgentList />
        </div>
      </div>
    </div>
  );
};

export default ModernWidgets;
