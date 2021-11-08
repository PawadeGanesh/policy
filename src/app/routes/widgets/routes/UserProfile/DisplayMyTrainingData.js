import React from "react";
import Auxiliary from "util/Auxiliary";
import ComputerIcon from '@material-ui/icons/Computer';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

const DisplayMyTrainingData = ({data}) => {
  const {name, date, status, isActive} = data;
  return (
<Auxiliary>
      {isActive===true?(
        <>
      <div className="media flex-nowrap mt-1 mt-lg-1 mb-1">
        <div className="mr-1">
        <Tooltip>
          <IconButton>
            <ComputerIcon style={{ color: "green" }} />
          </IconButton>
          </Tooltip>
        </div>
        <div className="media-body">
        <h5 className="mb-1">{name}</h5>
        {status === '' ? null : <p className="mb-0 text-green">{status} % Completed</p>}
        </div>
      </div>
      </>
      ):(
<>
<div className="media flex-nowrap mt-1 mt-lg-1 mb-1">
        <div className="mr-1">
        </div>
        <div className="media-body">
          <h5 className="mb-1">{name}</h5>
        </div>
      </div>

</>
      )}
    </Auxiliary>
  );
};

export default DisplayMyTrainingData;
