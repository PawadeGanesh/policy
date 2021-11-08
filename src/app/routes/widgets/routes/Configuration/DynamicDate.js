import React, { useState, useEffect, forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import DatePicker from "react-datepicker";
import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import localforage from "localforage";
import FormHelperText from "@material-ui/core/FormHelperText";

const Styles = styled.div`
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

const DynamicDate = forwardRef((props, ref) => {
  const {
    id,
    description,
    isEditable,
    key,
    name,
    value,
    isVisible,
    rowVersion,
  } = props;

  const [state, setState] = useState({
    date: new Date(value),
    id,
    rowVersion,
    typeOfComponent: "dynamicDate",
    endDate: new Date("3000-01-01"),
  });

  useEffect(() => {
    const { date } = state;
    const dateValueInApiFormat = moment(date).format("YYYY-MM-DD");

    if (dateValueInApiFormat === "") {
      return;
    } else if (dateValueInApiFormat !== value) {
      localforage
        .setItem("dynamicDate", {
          date: dateValueInApiFormat,
          id,
          rowVersion,
          typeOfComponent: "dynamicDate",
        })
        .then(function() {
          return localforage.getItem("dynamicDate");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicDate", function(err, value) {
        localforage.getItem("dynamicDate", function(err, value) {});
      });
    }
  }, [state]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      date: new Date(value),
    }));
  }, [props]);

  const handleDate = (date) => {
    setState((prevState) => ({
      ...prevState,
      date,
    }));
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
                {name} <br></br>
                <Typography variant="caption">{description}</Typography>
              </Typography>
            </div>
            <div class="col-xl-7 col-sm-12">
              <Styles>
                <DatePicker
                  isClearable
                  name={name}
                  placeholderText="Select Date"
                  dateFormat="yyyy-MM-dd"
                  selected={state.date}
                  onChange={(date) => handleDate(date)}
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
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
});

DynamicDate.propTypes = {};

export default DynamicDate;
