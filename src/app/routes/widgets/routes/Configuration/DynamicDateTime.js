import React, { useState, useEffect, forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import localforage from "localforage";
import FormHelperText from "@material-ui/core/FormHelperText";

const Styles = styled.div`
  .react-datepicker-wrapper,
  .react-datepicker__input-container,
  .react-datepicker__input-container input {
    width: 110%;
    height: 50px;
    text-align: center;
    font-family: revert;
    font-size: medium;

    border-radius: 4px;
    border-color: black;
    border-width: thin;
  }

  button {
    padding-left: 55px;
  }

  .react-datepicker__close-icon::before,
  .react-datepicker__close-icon::after {
  }
`;

const DynamicDateTime = forwardRef((props, ref) => {
  const {
    id,
    description,
    isEditable,
    name,
    value,
    isVisible,
    rowVersion,
  } = props;

  const [state, setState] = useState({
    date: new Date(value),
    id,
    rowVersion,
    typeOfComponent: "dynamicDateTime",
  });

  useEffect(() => {
    const { date } = state;

    const dateTimeValueInApiFormat = moment(date).format("YYYY-MM-DD HH:mm");

    if (dateTimeValueInApiFormat === "") {
      return;
    } else if (dateTimeValueInApiFormat !== value) {
      localforage
        .setItem("dynamicDateTime", {
          date: dateTimeValueInApiFormat,
          id,
          rowVersion,
          typeOfComponent: "dynamicDateTime",
        })
        .then(function() {
          return localforage.getItem("dynamicDateTime");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicDateTime", function(err, value) {
        localforage.getItem("dynamicDateTime", function(err, value) {});
      });
    }
  }, [state]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      date: new Date(value),
    }));
  }, [props]);

  const datePickerUseStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
  }));

  const datePickerClasses = datePickerUseStyles();

  const handleDateTime = (date) => {
    if (date) {
      setState((prevState) => ({
        ...prevState,
        date,
      }));
    }
  };

  const returnBoolean = (value) => {
    switch (value) {
      case 1:
        return true;
      case 0:
        return false;
    }
  };

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
              <form className={datePickerClasses.container} noValidate>
                <Styles>
                  <DatePicker
                    isClearable
                    name={name}
                    placeholderText="Select Date and Time"
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    selected={state.date}
                    timeFormat="HH:mm"
                    onChange={(date) => handleDateTime(date)}
                    disabled={!returnBoolean(isEditable)}
                  />
                </Styles>
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
              </form>
            </div>
          </div>
        </div>
      ) : (
        <form></form>
      )}
    </>
  );
});

DynamicDateTime.propTypes = {};

export default DynamicDateTime;
