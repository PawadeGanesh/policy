import React, { Component } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { FaHospital } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";
import { BsBuilding } from "react-icons/bs";
import HospitalList from "./HospitalList";
import FeatureDetails from "./FeatureDetails";
import RiderDetails from "./RiderDetails";
import InfoModal from "app/routes/widgets/routes/Modal/Info";
import "./style.css";

function TabContainer(props) {
  return <div style={{ padding: 20 }}>{props.children}</div>;
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

class ScrollableTabsButtonForce extends Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    const { company } = this.props.productData || {};

    return (
      <div className="w-100">
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.handleChange}
            variant="scrollable"
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Features" icon={<FaClipboardList />} />
            <Tab label="Network Hospitals" icon={<FaHospital />} />
            <Tab label="Riders" icon={<BiAddToQueue />} />
            {/* <Tab label="About Plan" icon={<FaInfoCircle/>}/> */}
            <Tab label={"About " + company} icon={<BsBuilding />} />
          </Tabs>
        </AppBar>
        {value === 0 && (
          <TabContainer>
            <FeatureDetails data={this.props.productData} />
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <HospitalList data={this.props.productData} />
          </TabContainer>
        )}
        {value === 2 && (
          <TabContainer>
            <RiderDetails data={this.props.productData} />
          </TabContainer>
        )}
        {/* {value === 3 &&
        <TabContainer>
          {'Details about the plan'}
        </TabContainer>} */}
        {value === 4 && (
          <TabContainer>
            <div className="row">
              <div className="col-md-4">
                <InfoModal message="Data is not available" />
              </div>
            </div>
          </TabContainer>
        )}
      </div>
    );
  }
}

export default ScrollableTabsButtonForce;
