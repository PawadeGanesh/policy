import React from "react";
import Select from "@material-ui/core/Select";

const InputSelect = ({
  labelId,
  id,
  value,
  onChange,
  label,
  children,
  name,
  native,
  required,
}) => {
  return (
    <>
      <Select
        native={native}
        labelId={labelId}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        label={label}
        fullWidth
        required={required}
      >
        {children}
      </Select>
    </>
  );
};

export default InputSelect;
