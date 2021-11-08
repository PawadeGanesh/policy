import React from "react";
import { Card, CardBody, CardText } from "reactstrap";
import { hospitalList } from "../productList/data";
import InfoModal from "app/routes/widgets/routes/Modal/Info";
import SearchBox from "components/SearchBox";
import { FaHospital } from "react-icons/fa";
import { AiOutlinePhone } from "react-icons/ai";
import "./style.css";

const HospitalList = (props) => {
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
              <div className="row">
                <div className="col-md-9">
                  List of Hospitals enlisted by{" "}
                  <strong>{(props.data || {}).company}</strong> in your city
                  where you can get Cashless Medical Services.
                </div>
                <div className="col-md-3">
                  <SearchBox styleName="d-none d-lg-block" placeholder="" />
                </div>
              </div>
              <div className="row">&nbsp;</div>
              <div className="row">
                {(hospitalList || []).map((hospData, index) => (
                  <div className="col-md-4">
                    <Card className={`shadow border-0`}>
                      <CardBody>
                        <CardText>
                          <h5 className="font-weight-bold">{hospData.name}</h5>
                          <p className="text-grey mb-1">
                            <FaHospital /> {hospData.address}
                          </p>
                          <p className="text-grey mb-1">
                            <AiOutlinePhone /> {hospData.phone}
                          </p>
                        </CardText>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HospitalList;
