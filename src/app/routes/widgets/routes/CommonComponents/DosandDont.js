import React, { useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputCancelButton from "./CancelButton";
import {getDos,getDnot} from "../../../../../setup/ApplicatoinConfigurations"
import {IconButton} from "@material-ui/core";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import "./modalPop.css"


const DosandDontComponent = ({DialogOpen,handle_RequestClose,DosData,DnotData }) => {

  const DnDContent = (
        <>
         
          <DialogContent>
            <div className="row">
            <div className="col-lg-6">
            <div className="row">
            <div className="col-lg-12">
            <IconButton ><ThumbUpAltIcon className="ThumdsUp"  style={{ fill: '#11f311'} }  /> </IconButton><span className="ModalTitle"><b>Do's</b></span>
            </div>
            <div className="col-lg-12">
            <span className="ModalDotext" dangerouslySetInnerHTML={{ __html: DosData }}></span> 
            </div>
            </div>
            </div>
            <div className="col-lg-6">
            <div className="row">
            <div className="col-lg-12">
            <IconButton ><ThumbDownIcon  className="ThumdsDown" style={{ fill: '#ff0000' }}  /> </IconButton><span className="ModalTitle"><b>Don'ts</b></span>
            </div>
            <div className="col-lg-12">
            <span className="ModalDoNoTtext" dangerouslySetInnerHTML={{ __html: DnotData }}></span> 
            </div>
            </div>
            </div>
            </div>
          </DialogContent>
          <DialogActions>
            <InputCancelButton
             onClick={handle_RequestClose}
             />
           
          </DialogActions>
        </>
      );

    return (
        <>
         <Dialog
        maxWidth="md"
        open={DialogOpen}
        onClose={handle_RequestClose}
      >
        {DnDContent}
      </Dialog>
        </>
    )

}


export default DosandDontComponent;



