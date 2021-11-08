import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";

const InputMultiSelectAutocomplete = ({
  className,
  id,
  name,
  onChange,
  options,
  value,
  renderInput,
  fullWidth,
  getOptionLabel
}) => {
  return (
    <>
      <Autocomplete
        multiple
        getOptionLabel={getOptionLabel}
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

export default InputMultiSelectAutocomplete;
