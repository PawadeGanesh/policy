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

export default function SuccessModal({ message, closeSuccess }) {
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
      closeSuccess();
    }, 5000);
  }, []);

  return (
    <div className={classes.root}>
      <Alert
        variant="filled"
        severity="success"
        onClose={closeSuccess}
        className="mb-3"
      >
        <strong>{message}</strong>
      </Alert>
    </div>
  );
}
