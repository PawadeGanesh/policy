import React, { useState, useEffect, forwardRef } from "react";
import { TextField } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import FormHelperText from "@material-ui/core/FormHelperText";
import Joi from "joi-browser";
import localforage from "localforage";

let schema = {};

const returnBoolean = (value) => {
  switch (value) {
    case 1:
      return true;
    case 0:
      return false;
  }
};

const DynamicTextfield = forwardRef((props, ref) => {
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
    console.log("name = ", name, "value = ", value);
    console.log("schema = ", schema);
    const obj = { [name]: value };
    const propertySchema = { [name]: schema[name] };
    console.log("propertySchema = ", propertySchema);
    const { error } = Joi.validate(obj, propertySchema);
    return error ? error.details[0].message : null;
  };

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
    typeOfComponent: "dynamicTextfield",
    didComponentDataChange: false,
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
        .setItem("dynamicTextfield", state)
        .then(function() {
          return localforage.getItem("dynamicTextfield");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicTextfield", function(err, value) {
        localforage.getItem("dynamicTextfield", function(err, value) {});
      });
    }
  }, [state]);

  function RenderTextField() {
    return (
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
            <TextField
              key={key}
              className="w-75"
              id={id}
              variant="outlined"
              onChange={(event) => onFieldChange(event, id)}
              value={state.validation[name]}
              name={name}
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
            {!ref.current.responseStatus ? (
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
    validation[input.name] = input.value;

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      didComponentDataChange: true,
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

export default React.memo(DynamicTextfield);
