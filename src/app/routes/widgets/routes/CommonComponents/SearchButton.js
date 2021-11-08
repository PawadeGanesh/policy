import React from "react";
import { Button } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import SearchIcon from "@material-ui/icons/Search";

const InputSearchButton = ({
    onClick
  }) => {
    
    return (
      <>
        <Button
     variant="contained"
     color="primary"
     className="mx-2"                  
     startIcon={<SearchIcon />}
           onClick={onClick}
           
        >
     <IntlMessages id="ipp.common.search.button" />
        </Button>
      </>
    );
  };

  export default InputSearchButton;