import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";
import localforage from "localforage";

const DynamicBooleanSwitch = forwardRef((props, ref) => {
  const { id, description, name, value, isVisible, rowVersion } = props;

  useEffect(() => {
    setState({
      ...state,
      booleanSwitch: { [name]: returnStringToBoolean(value) },
      id,
      rowVersion,
      typeOfComponent: "dynamicBooleanSwitch",
    });
  }, [props]);

  const [state, setState] = useState({
    booleanSwitch: {},
  });

  const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: "flex",
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      "&$checked": {
        transform: "translateX(12px)",
        color: theme.palette.common.white,
        "& + $track": {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: "none",
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);

  const returnStringToBoolean = (value) => {
    switch (value) {
      case "true":
        return true;
      case "false":
        return false;
    }
  };

  const returnBooleanToString = (value) => {
    switch (value) {
      case true:
        return "true";
      case false:
        return "false";
    }
  };

  const handleBoolean_SwitchChange = (event) => {
    const { name, checked } = event.target;
    event.stopPropagation();

    setState({
      ...state,
      booleanSwitch: { [name]: checked },
      id,
      rowVersion,
      typeOfComponent: "dynamicBooleanSwitch",
    });
  };

  useEffect(() => {
    if (returnBooleanToString(state.booleanSwitch[name]) === undefined) {
      return;
    } else if (returnBooleanToString(state.booleanSwitch[name]) !== value) {
      localforage
        .setItem("dynamicBooleanSwitch", {
          booleanSwitch: {
            [name]: returnBooleanToString(state.booleanSwitch[name]),
          },
          id,
          rowVersion,
          typeOfComponent: "dynamicBooleanSwitch",
        })
        .then(function() {
          return localforage.getItem("dynamicBooleanSwitch");
        })
        .then(function(value) {
          // we got our value
          console.log("dynamicBooleanSwitch stored  = ", value);
        })
        .catch(function(err) {
          // we got an error
          console.log("Data store error on initial run = ", err);
        });
    } else {
      localforage.removeItem("dynamicBooleanSwitch", function(err, value) {
        localforage.getItem("dynamicBooleanSwitch", function(err, value) {});
      });
    }
  }, [state]);

  return (
    <>
      {isVisible ? (
        <div className="w-100">
          <div class="row">
            <div class="col-xl-5 col-sm-12">
              <Typography>
                {name}
                <br></br>
                <Typography variant="caption">{description}</Typography>
              </Typography>
            </div>
            <div class="col-xl-7 col-sm-12">
              <Typography component="div">
                <Grid
                  component="label"
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>Off</Grid>
                  <Grid item>
                    <AntSwitch
                      aria-label="Acknowledge"
                      checked={state.booleanSwitch[name]}
                      onChange={handleBoolean_SwitchChange}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      onFocus={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                      }}
                      name={name}
                    />
                  </Grid>
                  <Grid item>On</Grid>
                </Grid>
              </Typography>
              {ref.current.responseStatus === "success" ? (
                <FormHelperText
                  style={{ color: "green" }}
                >{`${ref.current.responseStatus} - ${ref.current.responseMessage}`}</FormHelperText>
              ) : null}
              {ref.current.responseStatus === "failure" ? (
                <FormHelperText
                  style={{ color: "red" }}
                >{`${ref.current.responseStatus} - ${ref.current.responseMessage}`}</FormHelperText>
              ) : null}
              {ref.current.responseStatus === undefined ? (
                <FormHelperText style={{ color: "red" }}></FormHelperText>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
});

DynamicBooleanSwitch.propTypes = {};

export default DynamicBooleanSwitch;
