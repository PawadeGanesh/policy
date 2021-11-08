import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import SaveIcon from "@material-ui/icons/Save";


const InputSaveButton = ({
    onClick
  }) => {

  return (
    <>
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      className="mr-3 mb-2"
      startIcon={<SaveIcon />}
      
    >
      <IntlMessages id="ipp.common.Save.button" />
    </Button>
    </>
  );
};

export default InputSaveButton;