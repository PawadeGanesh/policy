import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import { data } from "../productList/data";
import { Link } from "react-router-dom";
import { BiLeftArrowAlt } from "react-icons/bi";
import ScrollableTabsButtonForce from "./ScrollableTabsButtonForce";
import { IoIosUmbrella } from "react-icons/io";

const ProductFeatures = () => {
  const [state, setState] = useState({
    data: {},
  });

  // let history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      data: (location.state || {}).detail,
    }));
  }, [location]);

  useEffect(() => {
    console.log("data", state.data);
  }, [state.data]);

  return (
    <div>
      <div className="row">
        <div className="col-md-3">
          <div className="user-list d-flex flex-row card shadow text-center">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <Link
                    to={{
                      pathname: "/app/wireframes/health/quotes",
                      state: { id: location.state.enquiryId },
                    }}
                  >
                    <Button color="primary">
                      <BiLeftArrowAlt />
                      &nbsp;&nbsp;View All Quotes
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="row">&nbsp;</div>
              <Divider inset />
              <div className="row">&nbsp;</div>
              <div className="row">
                <div className="col-md-12 int-content-center">
                  <Avatar
                    alt="..."
                    //src={data[this.props.match.params.idxValue].image}
                    src={state.data.logo}
                    className="user-avatar int-content-center"
                  />
                  <br></br>
                  <h4 className="font-weight-bold text-teal">
                    {/* {data[this.props.match.params.idxValue].name} */}
                    {state.data.productName}
                  </h4>
                </div>
              </div>
              <div className="row">&nbsp;</div>
              <Divider inset />
              <div className="row">&nbsp;</div>
              <div className="row">
                <div className="col-md-12">
                  <IoIosUmbrella />
                  &nbsp;&nbsp; Cover : &#8377;{" "}
                  {/* {data[this.props.match.params.idxValue].cover} */}
                  {(state.data.data || {}).cover}
                </div>
              </div>
              <div className="row">&nbsp;</div>
              <Divider inset />
              <div className="row">&nbsp;</div>
              <div className="row">
                <div className="col-md-12">
                  <Button
                    variant="contained"
                    className="jr-btn bg-teal text-white"
                  >
                    {/* &#8377;{data[this.props.match.params.idxValue].price} */}
                    {(state.data.data || {}).premium}
                    /Month
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-9">
          <ScrollableTabsButtonForce
          // productData={data[this.props.match.params.idxValue]}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFeatures;
