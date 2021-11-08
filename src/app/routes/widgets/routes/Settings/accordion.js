import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Details from "./accordionData";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const SimpleAccordion = ({
  categoryId,
  accordionName,
  getSuccess,
  getError,
}) => {
  console.log("categoryId", categoryId);
  const classes = useStyles();

  const handleClick = () => {
    console.log("cat-Id", categoryId);
  };

  return (
    <div className={classes.root}>
      <Accordion className="mb-3" style={{ backgroundColor: "whitesmoke" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon onClick={handleClick} />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            <b>{accordionName}</b>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Details
            categoryId={categoryId}
            successResponse={getSuccess}
            errorResponse={getError}
          />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default SimpleAccordion;
