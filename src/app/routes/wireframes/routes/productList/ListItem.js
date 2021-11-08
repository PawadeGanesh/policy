import React from "react";
import { Avatar, Button, Tooltip } from "@material-ui/core";
import "./style.css";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import { IoIosUmbrella } from "react-icons/io";
import { FaHospital } from "react-icons/fa";
import { ImStatsDots } from "react-icons/im";
import { Link, useHistory } from "react-router-dom";

const ListItem = ({ data, handleClick, enquiryId, idxVal, handlePremium }) => {
  return (
    <div className={`user-list d-flex flex-row  card shadow`}>
      <Avatar alt="..." src={data.logo} className="user-avatar " />

      <div className="description col-md-10 int-content-center">
        <div className="row">
          <div className="col-md-10">
            <h4 className="font-weight-bold text-teal">{data.productName}</h4>
            <h6>{data.name}</h6>
            {data.status === 2 ? (
              <h4 className="quote-msg">{data.userMessage}</h4>
            ) : (
              <div className="row">
                <div className="col-md-3">
                  {data.status === 1 ? (
                    <h4>
                      <Checkbox
                        color="primary"
                        value={data.id}
                        checked={data.isChecked ? true : false}
                        onChange={(e) =>
                          handleClick("right", e.currentTarget.checked, data)
                        }
                      />
                      Compare
                    </h4>
                  ) : null}
                  {data.status === 1 ? (
                    <Link
                      to={{
                        pathname: `/app/wireframes/health/features/0`,
                        state: {
                          detail: data,
                          enquiryId: enquiryId,
                        },
                      }}
                    >
                      View Features
                    </Link>
                  ) : null}
                </div>

                <div className="col-md-3">
                  <h6>
                    <IoIosUmbrella />
                    &nbsp;&nbsp;Cover
                  </h6>
                  {data.status === 0 ? (
                    <CircularProgress size="1rem" className="ml-3 mt-2" />
                  ) : data.status === 1 ? (
                    <h4>&#8377; {data.data.cover}</h4>
                  ) : null}
                </div>

                <div className="col-md-3">
                  <h6>
                    <FaHospital />
                    &nbsp;&nbsp;Hospitals
                  </h6>
                  {data.status === 0 ? (
                    <CircularProgress size="1rem" className="ml-4 mt-2" />
                  ) : data.status === 1 ? (
                    <h4>{data.data.hospitals}</h4>
                  ) : null}
                </div>
                <div className="col-md-3">
                  <h6>
                    <ImStatsDots />
                    &nbsp;&nbsp;Settlement Ratio
                  </h6>
                  {data.status === 0 ? (
                    <CircularProgress size="1rem" className="ml-5 mt-2" />
                  ) : data.status === 1 ? (
                    <h4>{data.data.settlementRatio}%</h4>
                  ) : null}
                </div>
              </div>
            )}

            {/* <p className="text-muted">{description}</p> */}
          </div>

          <div className="col-md-2 int-content-center text-center">
            {data.status === 0 ? (
              <CircularProgress size="1rem" className="ml-1 mt-5" />
            ) : data.status === 1 ? (
              <span>
                <Tooltip title="Click to Purchase Policy">
                  <Button
                    variant="contained"
                    className="jr-btn bg-teal text-white"
                    onClick={handlePremium(data)}
                  >
                    &#8377;{data.data.premium}
                  </Button>
                </Tooltip>
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
