import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";

const InputAutocomplete = ({
  className,
  id,
  name,
  onChange,
  options,
  value,
  renderInput,
  fullWidth,
}) => {
  return (
    <>
      <Autocomplete
        className={className}
        id={id}
        name={name}
        onChange={onChange}
        options={options}
        value={value}
        renderInput={renderInput}
        fullWidth={fullWidth}
      />
    </>
  );
};

export default InputAutocomplete;
