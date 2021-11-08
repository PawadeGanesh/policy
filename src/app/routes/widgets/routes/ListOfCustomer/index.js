
import React from "react";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";
import ListOfCustomer from "app/routes/widgets/routes/ListOfCustomer/ListOfCustomer";




const ModernWidgets = (props) => {
  console.log("currenturl:::::" + JSON.stringify(props))
  if (props.match.path === "/app/widgets/ListOfCustomer") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="ListOfCustomer.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <ListOfCustomer currentBaseUrl="/insurance/customers"/>
          </div>
        </div>
      </div>
    );
  }
  else if (props.match.path === "/app/widgets/MyCustomers") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="MyCustomers.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <ListOfCustomer currentBaseUrl="/insurance/my/customers"/>
          </div>
        </div>
      </div>
    );
  }
};

export default ModernWidgets;
