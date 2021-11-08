import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import {
    AiOutlineArrowRight,
    AiOutlineArrowLeft
  } from "react-icons/ai";

const InputNextButton = ({
    onClick,
  disabled
  }) => {

  return (
    <>
    <Button
     variant="contained"
     color="primary"
     className="mr-2"
      onClick={onClick}
      disabled={disabled}

    >
     <IntlMessages
     id={"retailinsurance.health.button.next"}
   />
           &nbsp;&nbsp;
           <AiOutlineArrowRight />
    </Button>
    </>
  );
};

export default InputNextButton;