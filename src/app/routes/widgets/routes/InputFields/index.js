
import React from "react";
import InputFields from "./InputFields";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";




const ModernWidgets = (props) => {
  return (
    <div className="animated slideInUpTiny animation-duration-3">
    <ContainerHeader match={props.match} title={<IntlMessages id="input.fields.master.title"/>}/>
      <div className="row">
        <div className="col-xl-12 col-sm-12 order-xl-1">
          <InputFields />

        </div>
              </div>
    </div>
  );
};

export default ModernWidgets;
