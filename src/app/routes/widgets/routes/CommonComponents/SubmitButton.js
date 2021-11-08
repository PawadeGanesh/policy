import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import SaveIcon from "@material-ui/icons/Save";

const InputSubmitButton = ({
    onClick,
  disabled
  }) => {

  return (
    <>
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      className="mr-3 mb-2"
      startIcon={<SaveIcon />}
      disabled={disabled}

    >
      <IntlMessages id="ipp.common.submit.button" />
    </Button>
    </>
  );
};

export default InputSubmitButton;