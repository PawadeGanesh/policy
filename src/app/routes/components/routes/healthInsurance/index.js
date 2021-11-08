import React, { Component } from "react";
import CardBox from "components/CardBox";
import IntlMessages from "util/IntlMessages";
import HorizontalLabelPositionBelowStepper from "./../stepper/linear/HorizontalLabelPositionBelowStepper";

class HealthInsurance extends Component {
  render() {
    return (
      <div>
        <h1>Health Insurance</h1>
        <div className="row">
          <CardBox
            styleName="col-lg-12"
            childrenStyle="d-flex justify-content-center"
            // heading={
            //   <IntlMessages id="component.stepper.horizontalLinearAlternativeLabel" />
            // }
            heading={"Please enter your details"}
            headerOutside
          >
            <HorizontalLabelPositionBelowStepper />
          </CardBox>
        </div>
      </div>
    );
  }
}
export default HealthInsurance;
