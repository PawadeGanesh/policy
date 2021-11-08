import React, { useState, useEffect } from "react";
import "./root.component.css";
import SimpleAccordion from "./accordion";
import apiInstance from "setup";
import axios from "axios";
import SuccessModal from "../Modal/Success";
import ErrorModal from "../Modal/Error";
import Dialog from "@material-ui/core/Dialog";
import "../CommonComponents/tableStyle.css";
import { apigetUrl } from "setup/middleware";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const App = () => {
  const [state, setState] = useState({
    data: [],
    isSuccessAlert: false,
    successMsg: "",
    isErrorAlert: false,
    errorMsg: "",
  });

  useEffect(() => {
    getAccordion();
  }, []);

  const getAccordion = () => {
    // axios
    //   .get(
    //     `${baseURL}/notify/core-data?page=1&limit=100&typeId=10`,
    //     apiInstance
    //   )
    apigetUrl(`/notify/core-data?page=1&limit=100&typeId=10`)
      .then((res) => {
        setState((prevState) => ({
          ...prevState,
          data: res.data.dataList,
        }));
      })
      .catch((err) => console.log("Err", err));
  };

  const getSuccessUpdate = (res) => {
    setState((prevState) => ({
      ...prevState,
      isSuccessAlert: true,
      successMsg: res.data.responseMessage,
    }));
  };

  const getErrorUpdate = (err) => {
    let error = err.response.data.responseMessage;
    let errMessage = error;
    setState((prevState) => ({
      ...prevState,
      errorMsg: errMessage,
      isErrorAlert: true,
    }));
  };

  const closeSuccessAlert = () => {
    setState((prevState) => ({
      ...prevState,
      isSuccessAlert: false,
    }));
  };

  const closeErrorAlert = () => {
    setState((prevState) => ({
      ...prevState,
      isErrorAlert: false,
    }));
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          {state.isSuccessAlert === true ? (
            <SuccessModal
              message={state.successMsg}
              closeSuccess={closeSuccessAlert}
            />
          ) : null}
          {state.isErrorAlert === true ? (
            <ErrorModal message={state.errorMsg} closeError={closeErrorAlert} />
          ) : null}
        </div>
      </div>
      <div
        component={Dialog}
        className="p-5"
        style={{ backgroundColor: "white" }}
      >
        {state.data &&
          state.data.map((n) => {
            return (
              <>
                {
                  <SimpleAccordion
                    key={n.id}
                    categoryId={n.id}
                    accordionName={n.name}
                    getSuccess={getSuccessUpdate}
                    getError={getErrorUpdate}
                  />
                }
              </>
            );
          })}
      </div>
    </>
  );
};

export default App;
