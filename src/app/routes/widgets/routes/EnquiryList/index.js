
import React from "react";
import EnquiryList from "./EnquiryList";
import ContainerHeader from "components/ContainerHeader";
import IntlMessages from "util/IntlMessages";

const ModernWidgets = (props) => {
  if (props.match.path==="/app/widgets/EnquiryList") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="EnquiryList.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <EnquiryList currentBaseUrl="/insurance/enquiry"/>
          </div>
        </div>
      </div>
    );
  }
  else if (props.match.path==="/app/widgets/MyEnquiries") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="MyEnquiry.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <EnquiryList currentBaseUrl="/insurance/my/enquiries"/>
          </div>
        </div>
      </div>
    );
  }
  else if (props.match.path==="/app/widgets/MyBookings") {
    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <ContainerHeader match={props.match} title={<IntlMessages id="MyBookings.master.title" />} />
        <div className="row">
          <div className="col-xl-12 col-sm-12 order-xl-1">
            <EnquiryList currentBaseUrl="/insurance/my/bookings"/>
          </div>
        </div>
      </div>
    );
  }
};

export default ModernWidgets;
