import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import CancelIcon from "@material-ui/icons/Cancel";

const InputCancelButton = ({ onClick, size }) => {
  return (
    <>
      <Button
        color="secondary"
        variant="contained"
        className="mr-1 mb-2"
        onClick={onClick}
        startIcon={<CancelIcon />}
        size={size}
      >
        <IntlMessages id="ipp.common.Cancel.button" />
      </Button>
    </>
  );
};

export default InputCancelButton;
