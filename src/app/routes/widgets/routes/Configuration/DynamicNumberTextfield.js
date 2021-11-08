import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Joi from "joi-browser";
import localforage from "localforage";

let schema = {};

const DynamicNumberTextfield = forwardRef((props, ref) => {
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

  const validateProperty = ({ name, value }) => {
    const onlyNums = value.replace(/[^0-9]/g, "");
    const obj = { [name]: onlyNums };
    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      validation: { [name]: value },
    }));

    schema = {
      [name]: Joi.string()
        .required()
        .label(name),
    };
  }, [props]);

  const [state, setState] = useState({
    validation: {},
    errors: {},
    isSaveButtonEnabled: true,
    id,
    rowVersion,
    typeOfComponent: "dynamicNumberTextfield",
  });

  useEffect(() => {
    let validationValueToBeChecked = "";
    for (var key of Object.keys(state.validation)) {
      validationValueToBeChecked = state.validation[key];
    }

    if (validationValueToBeChecked === "") {
      return;
    } else if (validationValueToBeChecked !== value) {
      localforage
        .setItem("dynamicNumberTextfield", state)
        .then(function() {
          return localforage.getItem("dynamicNumberTextfield");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicNumberTextfield", function(err, value) {
        localforage.getItem("dynamicNumberTextfield", function(err, value) {});
      });
    }
  }, [state]);

  const returnBoolean = (value) => {
    switch (value) {
      case 1:
        return true;
      case 0:
        return false;
    }
  };

  function RenderTextField() {
    return (
      <div className="w-100">
        <div class="row">
          <div class="col-xl-5 col-sm-12">
            <Typography>
              {name} <br></br>
              <Typography variant="caption">{description}</Typography>
            </Typography>
          </div>
          <div class="col-xl-7 col-sm-12">
            <TextField
              key={key}
              id={id}
              className="w-75"
              variant="outlined"
              onChange={(event) => onFieldChange(event, id)}
              value={state.validation[name]}
              name={name}
              type="number"
              disabled={!returnBoolean(isEditable)}
              inputRef={(input) => input && input.focus()} // very imp
              error={state.errors[name]}
              helperText={state.errors[name]}
            />

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
    );
  }

  const onFieldChange = (event) => {
    const { target: input } = event;

    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    const onlyNums = input.value.replace(/[^0-9]/g, "");
    validation[input.name] = onlyNums;

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
    }));
  };

  return (
    <>
      {isVisible ? (
        <>
          <RenderTextField />
        </>
      ) : (
        <></>
      )}
    </>
  );
});

DynamicNumberTextfield.propTypes = {};

export default React.memo(DynamicNumberTextfield);
