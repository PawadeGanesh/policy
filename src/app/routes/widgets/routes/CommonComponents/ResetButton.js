import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import RestoreIcon from "@material-ui/icons/Restore";

const InputResetButton = ({
    onClick
  }) => {

  return (
    <>
    <Button
      variant="contained"
      color="secondary"
      className="mx-2"
      startIcon={<RestoreIcon />}
      onClick={onClick}

    >
      <IntlMessages id="ipp.common.reset.button" />
    </Button>
    </>
  );
};

export default InputResetButton;