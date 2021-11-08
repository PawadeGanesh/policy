import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MaterialTable from "material-table";
import axios from "axios";
import { forwardRef } from "react";
import {
  Modal,
  TextField,
  Button,
  responsiveFontSizes,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Checkbox from "@material-ui/core/Checkbox";
import IntlMessages from "util/IntlMessages";

import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import { useAsyncDebounce } from "react-table";
import AddIcon from "@material-ui/icons/Add";
import { AndroidSharp } from "@material-ui/icons";
import InfoModal from "../Modal/Info";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import { useHistory } from "react-router-dom";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  AiOutlineArrowRight,
  AiOutlineArrowLeft
} from "react-icons/ai";

import "./master.css";
import apiInstance from "../../../../../setup/index";
import Joi from "joi-browser";
import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';
import InputAutocomplete from "../CommonComponents/Autocomplete";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputBackButton from "../CommonComponents/BackButton";
import InputNextButton from "../CommonComponents/NextButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import { ToastifyNotification, toast } from "../CommonComponents/ToastifyNotification";
import Chip from '@material-ui/core/Chip';
import { IPPNotification, ippNotify, } from "../CommonComponents/IPPNotification";
import LocationHierarchy from "../CommonComponents/LocationHierarchy";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
} from "../../../../../setup/middleware";




const EditAgentMapping = ({
    getEditSuccessUpdate,
    getEditErrorUpdate,
  closeEditUserManagement,
  callLocalBaseURL,
  // selectedId
  }) => {
  const [state, setState] = useState({
    activeStep: 0,
    firstname: "",
    lastname: "",
    mobileno: 0,
    emailid: "",
    username: "",
    role: "",
    newpassword: "",
    confrimationpassword: "",
    error: "",
    errors: {},
    isactive: false,
    location1:"",
    location2:"",
    location3:"",
    location4:"",
    keylockid:"",
    locationId:[]

  })

  const handler = (id,value) => {
    let valueId = id.toString();
      if(value==="zone"){
      setState((prevState) => ({
        ...prevState,
        location4: valueId,
      }));
    }
    else if(value==="state"){
      setState((prevState) => ({
        ...prevState,
        location3: valueId,
      }));
    }
    else if(value==="cluster"){
      setState((prevState) => ({
        ...prevState,
        location2: valueId,
      }));
    }
    else if(value==="district"){
      setState((prevState) => ({
        ...prevState,
        location1: valueId,
      }));
    }
    }
  

  

  return (
    <>
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
        <div className="row">
              <div className="col-lg-6">
                <InputField
                  required
                  className="mb-4"
                  autoFocus
                  id="firstname"
                  label={<IntlMessages id="RoCAgent.master.add.firstname"/>}
                  name="firstname"
                  //onChange={(e) => handleChangeFirstName(e)}
                 
                  fullWidth
                  error={state.errors.name}
                  helperText={state.errors.name}
                />
              </div>
              <div className="col-lg-6">
                <InputField
                  required
                  className="mb-4"
                  id="lastname"
                  label={<IntlMessages id="RoCAgent.master.edit.lastname"/>}
                  name="lastname"
                 
                  fullWidth
                  //onChange={(e) => handleChangeLastName(e)}
                  error={state.errors.name}
                  helperText={state.errors.name}
                />
              </div>

            </div>
            <div className="row">


              <div className="col-lg-6">
                <InputField
                  required
                  className="mb-4"
                  id="mobileno"
                  label={<IntlMessages id="RoCAgent.master.edit.mobileno"/>}
                  name="mobileno"
                  type="number"
                 
                  //onChange={(e) => handleChangeMobile(e)}
                  fullWidth
                  error={state.errors.kafkaTopic}
                  helperText={state.errors.kafkaTopic}
                />
              </div>
              <div className="col-lg-6">
                <InputField
                  required
                  className="mb-4"
                  //onChange={(e) => handleChangeEmailId(e)}
                  id="emailid"
                  label={<IntlMessages id="RoCAgent.master.edit.emailid"/>}
                  name="emailid"
                 
                  fullWidth
                  error={state.errors.name}
                  helperText={state.errors.name}
                />
              </div>
            </div>
            <div className="row">
            <div className="col-lg-12">
              <LocationHierarchy
              // inputId={dataOFLocation}
               handler={handler}
              // isActive={state.isActive}
              // handlingDefaultValue={handlingDefaultValue}
              />
            </div>
          </div>
          
            
            <div className="text-center">
              <div className="row"><br></br></div>
              <InputCancelButton
                //onClick={(e) => closeEditUserManagement(e)}

              />
               <InputSubmitButton
                  //onClick={(e) => handleSubmit(e)}
                />
              
            </div>
         
          {/* {state.err && (
            <FormHelperText error={Boolean(state.err)}>
              {state.err.responseMessage}
            </FormHelperText>
          )} */}
          <IPPNotification />
        </div>
      </CardBox>
    </div>
    </>
  );


}

export default EditAgentMapping;