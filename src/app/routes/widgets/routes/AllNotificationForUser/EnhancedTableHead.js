import React, {  } from "react";
import PropTypes from "prop-types";
import IntlMessages from "util/IntlMessages";
import "./master.css";
import {
  makeStyles,
  TableHead,
  TableCell,
  Tooltip,
  TableRow,
  TableSortLabel,
} from "@material-ui/core";



const EnhancedTableHead = (props) => {
  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };
  const { order, orderBy } = props;


  const style = {
    width: "25%",
  };




  return (
    <TableHead>
      <TableRow>
        <TableCell style={style}>
          <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "title"}
              direction={orderBy === "title" ? order : "asc"}
              onClick={createSortHandler("title")}
            >
             <IntlMessages id="AllNotificationForUser.master.tableheader.title.label"/>
            </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell style={style}>
        <IntlMessages id="AllNotificationForUser.master.tableheader.content.label"/>
        </TableCell>
        <TableCell style={style}>
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "created"}
              direction={orderBy === "created" ? order : "asc"}
              onClick={createSortHandler("created")}
            >
        <IntlMessages id="AllNotificationForUser.master.tableheader.createdDate.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell style={style}>
        <Tooltip title="Sort" enterDelay={300}>
            <TableSortLabel
              active={orderBy === "status"}
              direction={orderBy === "status" ? order : "asc"}
              onClick={createSortHandler("status")}
            >
        <IntlMessages id="AllNotificationForUser.master.tableheader.status.label"/>
        </TableSortLabel>
          </Tooltip>
        </TableCell>
        <TableCell style={style}>
        <IntlMessages id="AllNotificationForUser.master.tableheader.action.label"/>
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
