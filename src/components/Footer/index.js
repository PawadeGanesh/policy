import React, { useState } from "react";
// import Button from "@material-ui/core/Button";
// import IntlMessages from "util/IntlMessages";
import { Link } from "react-router-dom";
import { getPrivacyAndPolicy,getDos,getDnot } from "setup/ApplicatoinConfigurations";
import PrivacyandPolicy from "app/routes/widgets/routes/CommonComponents/PrivacyandPolicy";
import IntlMessages from "util/IntlMessages";
import DosandDontComponent from "app/routes/widgets/routes/CommonComponents/DosandDont";

const Footer = () => {
  const [state, setState] = useState({
    isPrivacyPolicy: false,
    DialogOpen:false,
    dos:[],
    dont:[],
  });

  const handlePNP = () => {
    setState((prevState) => ({
      ...prevState,
      isPrivacyPolicy: true,
    }));
  };

  const handleClose = () => {
    setState((prevState) => ({
      ...prevState,
      isPrivacyPolicy: false,
    }));
  };


  const handleDND =()=>{
    let dosString = getDos()
    let doNotString = getDnot()
    setState((prevState) => ({
      ...prevState,
      DialogOpen: true,
      dont: doNotString,
      dos: dosString,
    }));
  }

  const handle_RequestClose =()=>{
    setState((prevState) => ({
      ...prevState,
      DialogOpen: false
    }));
  }

  return (
    <>
     
      {state.isPrivacyPolicy ? (
        <>
          <PrivacyandPolicy
            value={getPrivacyAndPolicy()}
            handleClose={handleClose}
          />
        </>
      ) :state.DialogOpen ? (
        <>
      <DosandDontComponent
      DialogOpen={state.DialogOpen}
      handle_RequestClose={handle_RequestClose}
      DosData={state.dos}
      DnotData={state.dont}
      />
        </>

      ):null}
      <footer className="app-footer">
        <span className="d-inline-block">
          Copyright Jakkur Technoparks Pvt. Ltd. &copy; 2021
        </span>
        {/* <Button
        href="https://codecanyon.net/cart/configure_before_adding/20978545?license=regular&ref=phpbits&size=source&support=bundle_12month&_ga=2.172338659.1340179557.1515677375-467259501.1481606413"
        target="_blank"
        size="small"
        color="primary"
      >
        <IntlMessages id="eCommerce.buyNow" />
      </Button> */}
        <span>
          <Link className="mr-5"  onClick={handleDND}> <IntlMessages id="popup.DnD" /></Link>
          <Link onClick={handlePNP}><IntlMessages id="popup.PrivacyPolicy" /></Link>
        </span>
      </footer>
    </>
  );
};
export default Footer;
