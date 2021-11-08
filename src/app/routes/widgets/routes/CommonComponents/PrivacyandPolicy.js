import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import InputCancelButton from "./CancelButton";

const PrivacyandPolicy = ({ value, handleClose }) => {
  return (
    <>
      <Dialog maxWidth="md" open={true}>
        <DialogTitle>{"PrivacyPolicy"}</DialogTitle>
        <DialogContent dangerouslySetInnerHTML={{ __html: value }} />
        <DialogActions>
          <InputCancelButton onClick={handleClose} />
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrivacyandPolicy;
