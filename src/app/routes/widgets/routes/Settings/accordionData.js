import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import apiInstance from "setup";
import axios from "axios";
import Preferences from "./preferences";
import Paper from "@material-ui/core/Paper";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { apigetUrl } from "setup/middleware";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Details = ({ categoryId, successResponse, errorResponse }) => {
  const [state, setState] = useState({
    data: [],
    isSuucessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
  });
  const classes = useStyles();

  useEffect(() => {
    getAllEvents();
  }, []);

  const getAllEvents = () => {
    // axios
    //   .get(
    //     `${baseURL}/notify/events?page=1&limit=916&isUserOverrideAllowed=1&categoryId=${categoryId}`,
    //     apiInstance
    //   )
    apigetUrl(
      `/notify/events?page=1&limit=916&isUserOverrideAllowed=1&categoryId=${categoryId}`
    )
      .then((res) => {
        console.log("RES-Details", res.data.dataList);
        setState((prevState) => ({
          ...prevState,
          data: res.data.dataList,
        }));
      })
      .catch((err) => console.log("Err", err));
  };

  return (
    <>
      <div className="row container">
        <div className="col-lg-12">
          <TableContainer component={Paper} className="ml-4">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width="15%">Name</TableCell>
                  <TableCell width="10%">SMS</TableCell>
                  <TableCell width="10%">Email</TableCell>
                  <TableCell width="10%">InApp</TableCell>
                  <TableCell width="10%">Push</TableCell>
                  <TableCell width="10%">Action</TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>
          {state.data &&
            state.data.map((n) => {
              return (
                <>
                  <Preferences
                    name={n.name}
                    categoryId={categoryId}
                    eventId={n.id}
                    successData={successResponse}
                    errorData={errorResponse}
                  />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Details;
