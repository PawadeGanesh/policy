import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import keycode from "keycode";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import fetch from "cross-fetch";
import { Autocomplete, Alert } from "@material-ui/lab";
import DateFnsUtils from "@date-io/date-fns";
import IntlMessages from "util/IntlMessages";
import "./master.css";
import {
  ListItemIcon,
  Modal,
  makeStyles,
  CircularProgress,
  TableHead,
  TableFooter,
  TableCell,
  TableBody,
  IconButton,
  FormControl,
  Select,
  Toolbar,
  Tooltip,
  TableRow,
  TableSortLabel,
  TablePagination,
  Button,
  TextField,
  Grid,
  Card,
  Table,
  Typography,
  CardContent,
  MenuItem,
  InputLabel,
  useTheme,
} from "@material-ui/core";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { SettingsApplicationsOutlined } from "@material-ui/icons";
import CardBox from "./../../../../../components/CardBox/index";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import EditIcon from "@material-ui/icons/Edit";
import GetAppIcon from '@material-ui/icons/GetApp';
import ContainerHeader from "components/ContainerHeader";




const EnhancedTableHead = (props) => {
  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };
  const { order, orderBy } = props;


  const style = {
    width: "15%",
  };

  return (
    <TableHead>
      <TableRow>

        <TableCell width="12%">
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "firstName"}
              direction={orderBy === "firstName" ? order : "asc"}
              onClick={createSortHandler("firstName")}
            >
           <IntlMessages id="EnquiryList.master.tableheader.firstName.label"/>
           </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell width="12%">
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "middleName"}
              direction={orderBy === "middleName" ? order : "asc"}
              onClick={createSortHandler("middleName")}
            >
        <IntlMessages id="EnquiryList.master.tableheader.middleName.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell width="12%">
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "lastName"}
              direction={orderBy === "lastName" ? order : "asc"}
              onClick={createSortHandler("lastName")}
            >
        <IntlMessages id="EnquiryList.master.tableheader.lastName.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell width="15%">
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "mobileNo"}
              direction={orderBy === "mobileNo" ? order : "asc"}
              onClick={createSortHandler("mobileNo")}
            >
        <IntlMessages id="EnquiryList.master.tableheader.mobileNo.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell width="15%">
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "emailId"}
              direction={orderBy === "emailId" ? order : "asc"}
              onClick={createSortHandler("emailId")}
            >
        <IntlMessages id="EnquiryList.master.tableheader.emailId.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell width="15%">
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "requestDate"}
              direction={orderBy === "requestDate" ? order : "asc"}
              onClick={createSortHandler("requestDate")}
            >
        <IntlMessages id="EnquiryList.master.tableheader.requestDate.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell align="center" width="10%">
        <IntlMessages id="EnquiryList.master.tableheader.action.label"/>
        </TableCell>
       
      </TableRow>
    </TableHead>
  );


};

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;
