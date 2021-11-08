import React, { useState, useEffect } from "react";
import {
  apigetUrl,
  apiputUrl,
  apipostUrl,
} from "../../../../../setup/middleware";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import { Grid, TextareaAutosize } from "@material-ui/core";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import { width } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import { makeStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import { getResendOTP } from "../../../../../setup/ApplicatoinConfigurations";
import CountdownTimer from "../CommonComponents/CountdownTimer";
import InputField from "../CommonComponents/TextField";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import "./master.css";
import IntlMessages from "util/IntlMessages";

function App() {
  const { authUser } = useSelector(({ auth }) => auth);
  let user = authUser.userDetails;

  const labels = {
    1: "Very Poor",
    2: "Poor",
    3: "Ok",
    4: "Good",
    5: "Excellent",
  };

  const useStyles = makeStyles({
    root: {
      width: 400,
      display: "flex",
      alignItems: "center",
    },
  });

  // let timer = Date.now() + getResendOTPTime * 1000;
  //let timer = Date.now() + 15 * 1000;

  const location = useLocation();
  let history = useHistory();

  const [value, setValue] = React.useState();
  const [hover, setHover] = React.useState();
  const [description, setDescription] = React.useState();
  const [PolicyId, setPolicyId] = React.useState();
  const [PolicyName, setPolicyName] = React.useState();
  const [otp, setotp] = React.useState();
  const [progress, setProgress] = React.useState(getResendOTP());
  const classes = useStyles();

  const [state, setState] = useState({
    isActive: false,
    progressValue: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress === 0 ? 0 : prevProgress - 1
      );
    }, 1000);
  }, []);

  
  //Checking For PolicyId
  useEffect(() => {
    if (location.state) {
      setPolicyId(location.state.policyId);
      setPolicyName(location.state.policyName);
    }
  }, [location]);


  //submit otp
  const submitOTP = async () => {
    const Payload = {
      policyId: PolicyId,
      otp: otp,
    };
    const result = await apipostUrl(
      `/insurance/feedback/agent/verify-otp`,
      Payload
    );
    if (result.status === 200) {
      history.push("/app/widgets/SuccessPage");
    } else {
      ippNotify.error(result.data.responseStatus);
      setProgress(0);
    }
  };

  //submit feedback
  const submitFeedback = async () => {
    const Payload = {
      policyId: PolicyId,
      rating: value,
      description: description,
    };
    const result = await apipostUrl(
      `/insurance/feedback/agent/trigger`,
      Payload
    );
    if (result.status === 200) {
      ippNotify.success(result.data.responseStatus);
      setState((prevState) => ({
        ...prevState,
        isActive: true,
      }));
      setProgress(getResendOTP());
    } else {
      ippNotify.error(result.data.responseStatus);
    }
  };

  //description
  const handleDescription = (event) => {
    let description = event.target.value;
    setDescription(description);
  };

  //otp
  const handleOTP = (event) => {
    let otp = event.target.value;
    setotp(otp);
  };

  //circular progress for loader
  function CircularProgressWithLabel(props) {
    const normalise = (value) => ((value - 0) * 100) / (getResendOTP() - 0);
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
          <Typography variant="h6" component="div" color="error">{`${Math.round(
            props.value
          )}s`}</Typography>
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
  const ResetOtp = async() => {
    setProgress(getResendOTP());
    const Payload = {
      policyId: PolicyId,
      rating: value,
      description: description,
    };
    const result = await apipostUrl(`/insurance/feedback/agent/trigger`,Payload);
    if (result.status === 200) {
      ippNotify.success(result.data.responseStatus);
    } else {
      ippNotify.error(result.data.responseStatus);
    }
  };

  return (
    <>
      <div className="App">
        <div className="row">
          <div className="col-12">
            <form action="" className="contact-form jr-card mb-md-0">
            <IPPNotification/>
              {state.isActive ? (
                <>
                  <div className="row">
                    <div className="col-12">
                      <h3>
                      <IntlMessages id="AgentFeedback.OTPTitle" />
                      </h3>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-4"></div>
                    <div className="col-4">
                      <InputField
                        id="outlined-basic"
                        onChange={(event) => handleOTP(event)}
                        value={otp}
                        name="otp"
                        fullWidth
                        label={ <IntlMessages id="AgentFeedback.OTP" />}
                      />
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    {/* <div className="col-5"></div> */}
                    <div className="col-12">
                  
                      {progress === 0 ? (
                        <>
                        <div className="resendOTP">
                          <Link className="otpData" 
                          style={{ cursor: "pointer", color: "#3f51b5" }}
                          onClick={ResetOtp}>
                           <IntlMessages id="AgentFeedback.ResendOTP" />
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
              ) : (
                <>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <h2> <IntlMessages id="AgentFeedback.AgentName" /></h2>&nbsp;&nbsp;{user.fullName || ""}
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <h2> <IntlMessages id="AgentFeedback.ProductPurchased" /></h2>&nbsp;&nbsp;{PolicyName || ""}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <h2> <IntlMessages id="AgentFeedback.Rating" /></h2>
                        <div className={classes.root}>
                          <Rating
                            name="hover-feedback"
                            value={value}
                            precision={1}
                            size="large"
                            onChange={(event, newValue) => {
                              setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                              setHover(newHover);
                            }}
                          />
                          {value !== null && (
                            <Box ml={2}>
                              {labels[hover !== -1 ? hover : value]}
                            </Box>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div className="row">
                    <div className="col-12">
                      <div className="form-group">
                        <h2> <IntlMessages id="AgentFeedback.Description" /></h2>
                        <TextareaAutosize
                          aria-label="minimum height"
                          minRows={6}
                          maxRows={6}
                          style={{ width: "100%" }}
                          value={description}
                          onChange={(event) => handleDescription(event)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12">
                      <div className="pt-1 ml-1">
                        <InputSubmitButton onClick={submitFeedback} />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
