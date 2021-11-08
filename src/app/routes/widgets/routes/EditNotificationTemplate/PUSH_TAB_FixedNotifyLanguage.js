import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Joi from "joi-browser";
import PropTypes from "prop-types";
import IntlMessages from "util/IntlMessages";
import localforage from "localforage";
import InputField from "../CommonComponents/TextField";

function InnerTextField(props) {
  return (
    <InputField
      fullWidth
      id={props.name}
      label={props.label}
      name={props.name}
      value={props.value}
      // onChange={props.handleValueChanged(props.name)}
      onChange={props.handleValueChanged}
      helperText={props.helperText}
      error={props.error}
    />
  );
}

const schema = {
  notifyLanguage: Joi.string()
    .required()
    .label("Notify Language"),
};

function PUSH_TAB_FixedNotifyLanguage(props) {
  const {
    key,
    id,
    name,
    label,
    value,
    helperText,
    error,
    onChange,
    className,
  } = props;
  // const [state, setState] = useState({ value: "", name: "" });

  // const handleValueChanged = (name) => (event) => {
  //   setState({ ...state, value: event.target.value, name: event.target.name });
  // };

  useEffect(() => {
    // console.log("value = ", value);
    setState((prevState) => ({
      ...prevState,
      validation: { notifyLanguage: value },
    }));
  }, [props]);

  const [state, setState] = useState({
    validation: {
      notifyLanguage: "",
    },
    errors: {},
  });

  const validateProperty = ({ name, value }) => {
    console.log("name = ", name, "value = ", value);
    const obj = { [name]: value };
    console.log("schema[name] = ", schema[name]);

    const propertySchema = { [name]: schema[name] };
    console.log("propertySchema = ", propertySchema);
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

  const checkAreAllEditFormFieldsPopulated = (obj) => {
    return !Object.values(obj).some((x) => x === "");
  };

  const onTextFieldsChange = (event) => {
    //event.stopPropagation();
    //event.persist();
    // console.log("target.name = ", event.target.name);
    // console.log("currentTarget.name = ", event.currentTarget.name);
    const { target: input } = event;
    //console.log("input = ", input.name);
    //console.log("input = ", input.value);
    //e = event.native; // This looks the same as a vanilla JS event
    //console.log(e.target.id);
    //console.log("input = ", input);

    const errors = { ...state.errors };
    const errorMessage = validateProperty(input);
    if (errorMessage) errors[input.name] = errorMessage;
    else delete errors[input.name];

    const validation = { ...state.validation };
    validation[input.name] = input.value;

    const allFormFieldsPopulated = checkAreAllEditFormFieldsPopulated(
      validation
    );
    // console.log("allFormFieldsPopulated = ", allFormFieldsPopulated);

    // console.log("validation = ", validation);
    // console.log("errors = ", errors);

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
      //  isEditFormSubmitDisabled: allFormFieldsPopulated && isObjEmpty(errors),// signal to the editnotificationtemplate to disable saveall button
    }));
    // console.log(
    //   "truth check",
    //   state.areAllAddFormFieldsPopulated && isObjEmpty(errors)
    // );

    // if (input.name === "fieldType") {
    //   validation["dataListId"] = "";
    //   // checkEditForm_DataListIdAvailability(input.value);
    // } else {
    //   delete validation["dataListId"];
    // }
  };

  useEffect(() => {
    localforage
      .setItem("PUSH_TAB_FixedNotifyLanguage", {
        notifyLanguage: state.validation.notifyLanguage,
        name: "notifyLanguage",
      })
      .then(function() {
        return localforage.getItem("PUSH_TAB_FixedNotifyLanguage");
      })
      .then(function(value) {
        // we got our value
        //console.log("PUSH_TAB_FixedNotifyLanguage Data stored", value);
      })
      .catch(function(err) {
        // we got an error
        console.log("Data store error on initial run = ", err);
      });
  }, [state]);

  return (
    <div className={className}>
      <InnerTextField
        key={key}
        id={id}
        name={name}
        label={label}
        value={state.validation.notifyLanguage}
        // value={value}
        autoFocus
        handleValueChanged={onTextFieldsChange}
        helperText={state.errors.notifyLanguage}
        error={state.errors.notifyLanguage}
      />
    </div>
  );
}

PUSH_TAB_FixedNotifyLanguage.propTypes = {};

export default PUSH_TAB_FixedNotifyLanguage;
