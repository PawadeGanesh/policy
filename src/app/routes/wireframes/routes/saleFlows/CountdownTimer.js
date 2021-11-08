import React from "react";
import PropTypes from "prop-types";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import { getResendOTP } from "setup/ApplicatoinConfigurations";
import { apiputUrl,apipostUrl } from "setup/middleware";

function CircularProgressWithLabel(props) {
  const normalise = (value) => ((value - 0) * 100) / (getResendOTP() - 0);
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        {...props}
        value={normalise(props.value)}
        size="5rem"
        thickness="2.5"
      />
      <Box
        top={10}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="error">
          <b>
            <h3>{`${Math.round(props.value)}s`}</h3>
          </b>
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

const CountdownTimer = ({ enquiryId, showLink,quotationId,GetPaymentGetWayButton,quotationsData,enquiryQuotationId }) => {
  const [progress, setProgress] = React.useState(getResendOTP());
  const [showResendLink, setShowResendLink] = React.useState(showLink);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress === 0 ? 0 : prevProgress - 1
      );
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const handleResendOTP = () => {
    if(GetPaymentGetWayButton===true){
      setProgress(getResendOTP());
      setShowResendLink(false);
      apipostUrl(`/insurance/enquiry/${enquiryQuotationId}/quotes/${quotationId}/sale`,quotationsData);
      
    }
    else{
    setProgress(getResendOTP());
    setShowResendLink(false);
    apiputUrl(`/insurance/enquiry/${enquiryId}/otp/resend`);
    }
  };

  return (
    <>
      {progress === 0 || showResendLink ? (
        <>
          <span>
            <Link
              onClick={handleResendOTP}
              style={{ cursor: "pointer", color: "#3f51b5" }}
            >
              <h3>Resend OTP</h3>
            </Link>
          </span>
        </>
      ) : (
        <CircularProgressWithLabel value={progress} />
      )}
    </>
  );
};

export default CountdownTimer;
