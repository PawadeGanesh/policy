import React from "react";
import { Card, CardBody, CardText } from "reactstrap";
import { riderDetails } from "../productList/data";
import Checkbox from "@material-ui/core/Checkbox";
import InfoModal from "app/routes/widgets/routes/Modal/Info";
import "./style.css";

const RiderDetails = (props) => {
  return (
    <div>
      <div className="row">
        {props.data === undefined ? (
          <div className="col-md-4 features">
            <InfoModal message="Data is not available" />
          </div>
        ) : (
          <>
            {(riderDetails || []).map((riderData, index) => (
              <div className="col-md-12">
                <Card className={`shadow border-0`}>
                  <CardBody>
                    <CardText>
                      <div className="row">
                        <div className="col-md-1">
                          <Checkbox color="primary" />
                        </div>
                        <div className="col-md-10">
                          <h5 className="font-weight-bold">
                            {riderData.title}
                          </h5>
                          <p className="text-grey mb-1">
                            {riderData.description}
                          </p>
                        </div>
                        <div className="col-md-1">
                          <h3>&#8377; {riderData.value}</h3>
                        </div>
                      </div>
                    </CardText>
                  </CardBody>
                </Card>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RiderDetails;
