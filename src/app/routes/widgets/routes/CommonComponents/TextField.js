import React from "react";
import { TextField } from "@material-ui/core";

const InputField = ({
  value,
  label,
  id,
  name,
  onChange,
  error,
  helperText,
  required,
  autoFocus,
  fullWidth,
  className,
  placeholder,
  type,
  onInput,
  disabled
}) => {
  return (
    <>
      <TextField
        className={className}
        id={id}
        type={type}
        error={error}
        helperText={helperText}
        label={label}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required={required}
        autoFocus={autoFocus}
        fullWidth={fullWidth}
        variant="outlined"
        onInput={onInput}
        disabled={disabled}
      />
    </>
  );
};

export default InputField;
