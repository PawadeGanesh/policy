import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import IntlMessages from "util/IntlMessages";
import { AiOutlineClose } from "react-icons/ai";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { IoIosUmbrella } from "react-icons/io";
import { FaHospital } from "react-icons/fa";
import { data01 } from "app/routes/charts/routes/scatter/Components/data";

const ListCompareItem = ({ data, styleName, onCloseProduct }) => {
  console.log("allData", data);
  // const {
  //   image,
  //   name,
  //   designation,
  //   price,
  //   annualprice,
  //   cover,
  //   hospitals,
  //   description,
  // } = props.data;
  return (
    <div className="row">
      <div className="col-md-12 int-content-center">
        <div className={`user-list d-flex flex-row  ${styleName}`}>
          <Avatar alt="..." src={data.logo} className="user-avatar" />
          <div className="description col-md-8">
            <div className="row">
              <div className="col-md-10">
                <h5 className="font-weight-bold">{data.productName}</h5>
                <h6>{"30 days waiting perios for Covid-19"}</h6>
                <div className="manage-margin d-flex align-items-center justify-content-around flex-wrap">
                  <Avatar
                    className="bg-warning size-30 "
                    style={{
                      marginTop: `-170px`,
                      marginRight: `-250px`,
                    }}
                  >
                    <AiOutlineClose
                      onClick={(e) => onCloseProduct(e, data)}
                      className=" text-white"
                    />
                  </Avatar>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListCompareItem;
