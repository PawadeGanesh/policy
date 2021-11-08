import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import {
    AiOutlineArrowRight,
    AiOutlineArrowLeft
  } from "react-icons/ai";

const InputBackButton = ({
    onClick,
  disabled
  }) => {

  return (
    <>
    <Button
      variant="contained"
      onClick={onClick}
      className="mr-2"
      disabled={disabled}

    >
      <AiOutlineArrowLeft />
      &nbsp;&nbsp;
                      <IntlMessages id="retailinsurance.health.button.back" />
    </Button>
    </>
  );
};

export default InputBackButton;