import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import AddIcon from "@material-ui/icons/Add";

const InputAddButton = ({ onClick, className, disabled, size }) => {
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={onClick}
        className={className}
        startIcon={<AddIcon />}
        disabled={disabled}
        size={size}
      >
        <IntlMessages id="ipp.common.ADD.button" />
      </Button>
    </>
  );
};

export default InputAddButton;
