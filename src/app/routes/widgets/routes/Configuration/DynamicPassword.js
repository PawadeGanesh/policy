import React, { useEffect } from "react";
import { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import clsx from "clsx";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
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

const DynamicPassword = forwardRef((props, ref) => {
  const {
    id,
    description,
    isEditable,
    name,
    value,
    isVisible,
    rowVersion,
  } = props;

  useEffect(() => {
    setState({ ...state, validation: { password: value }, id, rowVersion });

    schema = {
      password: Joi.string()
        .required()
        .label("Password"),
    };
  }, [props]);

  const checkBox_UseStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    formControl: {
      margin: theme.spacing(3),
    },
  }));

  const checkBoxClasses = checkBox_UseStyles();

  const [state, setState] = React.useState({
    validation: { password: value, showPassword: false },
    errors: {},
    id: "",
    rowVersion,
    typeOfComponent: "dynamicPassword",
  });

  const validateProperty = ({ name, value }, prop) => {
    const obj = { [prop]: value };
    const propertySchema = { [prop]: schema[prop] };
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

  const handleChange = (prop) => (event) => {
    const { target: input } = event;

    const errors = { ...state.errors };
    const errorMessage = validateProperty(input, prop);
    if (errorMessage) errors[prop] = errorMessage;
    else delete errors[prop];

    const validation = { ...state.validation };
    validation[prop] = input.value;

    setState((prevState) => ({
      ...prevState,
      validation,
      errors,
    }));
  };

  useEffect(() => {
    const { password } = state.validation;

    if (password === "") {
      return;
    } else if (password !== value) {
      localforage
        .setItem("dynamicPassword", state)
        .then(function() {
          return localforage.getItem("dynamicPassword");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicPassword", function(err, value) {
        localforage.getItem("dynamicPassword", function(err, value) {});
      });
    }
  }, [state]);

  const handleClickShowPassword = () => {
    setState({
      ...state,
      validation: { showPassword: !state.validation.showPassword },
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return isVisible ? (
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
          <FormControl
            className={clsx(checkBoxClasses.margin, checkBoxClasses.textField)}
            variant="outlined"
          >
            <OutlinedInput
              id={id}
              name={name}
              className="w-75"
              type={state.validation.showPassword ? "text" : "password"}
              value={state.validation.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {state.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
              disabled={!returnBoolean(isEditable)}
              error={state.errors["password"]}
            />
            <FormHelperText style={{ color: "red" }} id="component-error-text">
              {state.errors["password"]}
            </FormHelperText>
          </FormControl>
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
  );
});

DynamicPassword.propTypes = {};

export default DynamicPassword;
