import React, { useState, useEffect } from "react";
import { apigetUrl, apiputUrl, apipostUrl } from "../setup/middleware";
import { IPPNotification, ippNotify, } from "../app/routes/widgets/routes/CommonComponents/IPPNotification";
import { Grid, TextareaAutosize } from "@material-ui/core";
import InputSubmitButton from "../app/routes/widgets/routes/CommonComponents/SubmitButton";
import { width } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { makeStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';
import CountdownTimer from "../app/routes/widgets/routes/CommonComponents/CountdownTimer";
import InputField from "../app/routes/widgets/routes/CommonComponents/TextField";
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import IntlMessages from "util/IntlMessages";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import './sucessPageStyle.css'

function App() {

  const [value, setValue] = React.useState();
  const [hover, setHover] = React.useState();
  const [description, setDescription] = React.useState();
  const [PolicyId, setPolicyId] = React.useState();
  const [PolicyName, setPolicyName] = React.useState();
  const [token, setToken] = useState("");
  const [otp, setotp] = React.useState();
  const [username, setusername] = React.useState();
  const [progress, setProgress] = React.useState(120);

  let history = useHistory();

  const labels = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Ok',
    4: 'Good',
    5: 'Excellent',
  };

  const useStyles = makeStyles({
    root: {
      width: 400,
      display: 'flex',
      alignItems: 'center',
    },
  });

  const classes = useStyles();

  const [state, setState] = useState({
    isActive: true,
    progressValue: 0,
  })


  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress === 0 ? 0 : prevProgress - 1
      );
    }, 1000);
  }, []);

  useEffect(() => {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let key = urlParams.get('token')
    let policy = urlParams.get('policyId')
    setToken(key)
    setPolicyId(policy)
  
  }, []);



  //circular progress for loader
  function CircularProgressWithLabel(props) {
    const normalise = (value) => ((value - 0) * 100) / (120 - 0);
    return (
      <Box position="relative" display="inline-flex">
        <CircularProgress variant="determinate" 
        {...props}
        size="5rem"
        thickness="2.5"
        value={normalise(props.value)}
         />
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
           <Typography variant="h6" component="div" color="error">
          
            {`${Math.round(props.value)}s`}
        </Typography>
        </Box>
      </Box>
    );
  }

  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

  //reset Otp
  const ResetOtp = async () => {
    setProgress(120);
  };

  //otp
  const handleOTP = (event) => {
    let otp = event.target.value
    setotp(otp)
  }


  //submit otp
  const submitOTP = async () => {
    const Payload = {
      policyId: PolicyId,
      otp: otp
    }
    const result = await apipostUrl(`/insurance/feedback/self/verify-otp`, Payload)
    if (result.status === 200) {
      setusername(result.data.agentId)
      setState((prevState) => ({
        ...prevState,
        isActive: false
      }));
    }
    else {
      ippNotify.error(result.data.responseStatus);
      setProgress(0);
    }
  }

   //submit feedback
   const submitFeedback = async () => {
    const Payload = {
      policyId: PolicyId,
      rating: value,
      description:description,
      otp:otp 
  }
  const result = await apipostUrl(`/insurance/feedback/self/save`, Payload)
    if (result.status === 200) {
      history.push('/CustomerFeedbackSuccessPage');
    }
  else{
    ippNotify.error(result.data.responseStatus);
  }
  }

  //description
  const handleDescription = (event) => {
    let description = event.target.value
    setDescription(description)
  }


  return (
    <div className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
      <div className="app-login-main-content">
        <div className="app-logo-content d-flex align-items-center justify-content-center">
          <Link className="logo-lg" to="/" title="InsureKart">
            <img
              src={require("assets/images/logo.png")}
              alt="InsureKart"
              title="InsureKart"
            />
          </Link>
        </div>

        <div className="app-login-content">
          <div className="app-login-header mb-5">
            <h1><IntlMessages id="product.name" /></h1>
            {state.isActive ? (
                  <>
            <h3><IntlMessages id="CustomerFeedback.OTPTitle" /></h3>
            </>
            ):null}
          </div>

          <div className="app-login-form">
            <form>
              <fieldset>
                <IPPNotification />
                {state.isActive ? (
                  <>

                  <div className="row">
                    <div className="col-12">
                      <InputField
                        id="outlined-basic"
                        onChange={(event) => handleOTP(event)}
                        value={otp}
                        name="otp"
                        fullWidth
                        label={<IntlMessages id="CustomerFeedback.OTP" />}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-12">

                      {progress === 0 ? (
                        <>
                        <div className="resendOTP">
                          <Link className="otpData"
                            style={{ cursor: "pointer", color: "#3f51b5" }}
                            onClick={ResetOtp}>
                            <IntlMessages id="CustomerFeedback.ResendOTP" />
                          </Link>
                        </div>
                        </>
                      ) : (
                          <>
                          <div className="Loading">
                            <CircularProgressWithLabel value={progress} />
                          </div>
                          </>
                        )}


                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-12">
                      <div className="submitbutton">
                        <InputSubmitButton onClick={submitOTP} />
                      </div>
                    </div>
                  </div>
                  </>
                ) :
                  (
                    <>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <h2><IntlMessages id="CustomerFeedback.AgentName" /></h2>&nbsp;&nbsp;{username}

                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <h2><IntlMessages id="CustomerFeedback.ProductPurchased" /></h2>

                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <h2 ><IntlMessages id="CustomerFeedback.Rating" /></h2>
                          <div className={classes.root}>
                            <Rating
                              name="hover-feedback"
                              value={value}
                              precision={1}
                              size='large'
                              onChange={(event, newValue) => {
                                setValue(newValue);
                              }}
                              onChangeActive={(event, newHover) => {
                                setHover(newHover);
                              }}
                            />
                            {value !== null && <Box ml={2}>{labels[hover !== -1 ? hover : value]}</Box>}
                          </div>
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-12">
                        <div className="form-group">
                          <h2><IntlMessages id="CustomerFeedback.Description" /></h2>
                          <TextareaAutosize
                            aria-label="minimum height"
                            minRows={3} maxRows={3}
                            style={{ width: "100%" }}
                            onChange={(event) => handleDescription(event)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <div className="pt-1 ml-1">
                          <InputSubmitButton
                            onClick={submitFeedback}
                          />
                        </div>
                      </div>
                    </div>
                    </>
                  )}

              </fieldset>
            </form>
          </div>
        </div>
      </div>
      <IPPNotification />
    </div>
  );
}

export default App;
