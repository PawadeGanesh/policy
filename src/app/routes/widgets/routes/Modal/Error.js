import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const ErrorModal = ({ message, closeError }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    hideAlert: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        hideAlert: true,
      }));
      closeError();
    }, 5000);
  }, []);

  return (
    <div className={classes.root}>
      <Alert
        className="text-center"
        variant="filled"
        severity="error"
        onClose={closeError}
        className="mb-3"
      >
        {/* <strong>{message.slice(10)}</strong> */}
        <strong>{message}</strong>
      </Alert>
    </div>
  );
};

export default ErrorModal;
