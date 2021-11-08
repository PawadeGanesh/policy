import React from "react";
import InfoModal from "app/routes/widgets/routes/Modal/Info";
import { Card, CardBody, CardText } from "reactstrap";
import "./style.css";

const FeatureDetails = (props) => {
  console.log("props-data", props.data);
  return (
    <>
      <div>
        <div className="row">
          {props.data === undefined ? (
            <div className="col-md-4 features">
              <InfoModal message="Data is not available" />
            </div>
          ) : (
            <>
              {((props.data || {}).features || []).map((featureGrp, index) => (
                <div className="col-md-4">
                  <h3 className="font-weight-bold>">
                    {featureGrp.featureGroup}
                  </h3>
                  {featureGrp.data.map((feature, index2) => (
                    <Card className={`shadow border-0`}>
                      <CardBody>
                        <CardText>
                          <h5 className="mb-0">{feature.title}</h5>
                          <p className="text-grey mb-1">
                            {feature.description}
                          </p>
                        </CardText>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FeatureDetails;
