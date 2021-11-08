import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "25%",
    // backgroundColor: "#3f51b5",
    // color: "white",
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    position: "relative",
    // left: "50%",
    marginTop: "20px",
  },
}));

const InfoModal = ({ message }) => {
  const classes = useStyles();
  const [state, setState] = useState({
    showAlert: false,
  });

  useEffect(() => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        showAlert: true,
      }));
    }, 1000);
  }, []);

  return (
    <React.Fragment>
      {state.showAlert ? (
        <div className={classes.root}>
          {/* <Alert
            className="text-center"
            variant="filled"
            severity="warning"
            className="mb-3"
          >
            <strong>{message}</strong>
          </Alert> */}
          <Alert severity="warning">
            <AlertTitle>Warning</AlertTitle>
            <strong>{message}</strong>
          </Alert>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default InfoModal;
