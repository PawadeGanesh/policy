import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import InputField from "../CommonComponents/TextField";
import "./root.component.css";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import FormControl from "@material-ui/core/FormControl";
import IntlMessages from "util/IntlMessages";
import CardBox from "../../../../../components/CardBox";
import InputSelect from "../CommonComponents/Select";
import { apigetUrl, apipostUrl } from "setup/middleware";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import InputAddButton from "../CommonComponents/AddButton";
import InputAutocomplete from "../CommonComponents/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import FieldArea from "./FieldArea";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import Loader from "../CommonComponents/Loader";

const App = () => {
  const [state, setState] = useState({
    isLoading: false,
    page: 1,
    limit: 1000,
    message: "",
    subject: "",
    title: "",
    sms: false,
    email: false,
    push: false,
    inapp: false,
    isCheckFieldActive: false,
    isMessageFieldActive: false,
    isSubjectFieldActive: false,
    isTitleFieldActive: false,
    isCheck: false,
    isMessage: false,
    isSubject: false,
    isTitle: false,
    roleId: "",
    isRoleActive: false,
    isUserChangeActive: false,
    roleData: [],
    userData: [],
    userListData: [],
    userSelectedData: [],
    userFilteredData: [],
    isUserActive: false,
    isallUserActive: false,
    isAddFormSubmitDisabled: false,
  });

  useEffect(() => {
    getRoleData();
  }, []);

  const handleAddFormChange = (e) => {
    console.log("event", e.target.checked);
    const { name, checked } = e.target;
    if (
      name === "sms" ||
      name === "email" ||
      name === "push" ||
      name === "inapp"
    ) {
      setState((prevState) => ({
        ...prevState,
        [name]: checked,
        isCheckFieldActive: true,
        isCheck: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isCheckFieldActive: false,
        isCheck: false,
      }));
    }
  };

  const handleMessageAddFormChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        isMessageFieldActive: false,
        isMessage: true,
      }));
    } else if (!value) {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        isMessageFieldActive: true,
        isMessage: false,
      }));
    }
  };

  const handleSubjectAddFormChange = (e) => {
    const { name, value } = e.target;
    if (value) {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        isSubjectFieldActive: false,
        isSubject: true,
      }));
    } else if (!value) {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        isSubjectFieldActive: true,
        isSubject: false,
      }));
    }
  };

  const handleTitleAddFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.length !== 0) {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        isTitleFieldActive: false,
        isTitle: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value,
        isTitleFieldActive: true,
        isTitle: false,
      }));
    }
  };

  const getRoleData = () => {
    apigetUrl(`/auth/login/roles?page=${state.page}&limit=${state.limit}`)
      .then((res) => {
        console.log("res-123", res);
        if (res.data.responseCode === "200") {
          setState((prevState) => ({
            ...prevState,
            roleData: res.data.dataList,
          }));
        }
        if (res.data.responseStatus === "failure") {
          ippNotify.error(res.data.responseMessage);
        }
      })
      .catch((err) => ippNotify.error(err.data.responseMessage));
  };

  const getUserData = (roleId) => {
    apigetUrl(`/auth/login/roles-members/${roleId}`)
      .then((res) => {
        console.log("res-456", res);
        if (res.data.responseCode === "200") {
          setState((prevState) => ({
            ...prevState,
            userData: res.data.dataList,
          }));
        }
        if (res.data.responseStatus === "failure") {
          ippNotify.error(res.data.responseMessage);
        }
      })
      .catch((err) => ippNotify.error(err.data.responseMessage));
  };

  const handleRoleChange = (e, value) => {
    console.log("value", value);
    console.log("value-123", state.roleData);
    let roleInfo = (state.roleData || []).filter((n) => n.name === value)[0];
    if (value) {
      setState((prevState) => ({
        ...prevState,
        roleId: (roleInfo || {}).roleId,
        isRoleActive: true,
      }));
      getUserData(roleInfo.roleId);
    } else if (value === null) {
      setState((prevState) => ({
        ...prevState,
        roleId: (roleInfo || {}).roleId,
        isRoleActive: false,
        isUserChangeActive: false,
      }));
    }
  };

  const handleUserChange = (e, value) => {
    console.log("value-2", value.length);
    if (value.length !== 0) {
      setState((prevState) => ({
        ...prevState,
        userListData: value,
        isUserChangeActive: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        userListData: value,
        isUserChangeActive: false,
      }));
    }
  };

  const handleAdd = () => {
    let userSelectedId = state.userListData.map((n) => n.keyCloakId);
    // Filter the Selected Data and Seperate it
    let filteredSlectedData = state.userData.filter(
      (item) => !userSelectedId.includes(item.keyCloakId)
    );

    setState((prevState) => ({
      ...prevState,
      userData: filteredSlectedData,
      userSelectedData: state.userListData,
      isUserActive: true,
    }));
  };

  const handleAllUser = () => {
    let addAllUsers = state.userData;
    console.log("data", addAllUsers);
    setState((prevState) => ({
      ...prevState,
      userSelectedData: addAllUsers,
      isallUserActive: true,
    }));
  };

  const handleDelete = (id) => {
    let addRemoveUserData = state.userData;
    let findDeletedData = state.userSelectedData.find(
      (n) => n.keyCloakId === id
    );
    addRemoveUserData.push(findDeletedData);

    let removeSlectedData = state.userSelectedData.filter(
      (item) => !id.includes(item.keyCloakId)
    );
    setState((prevState) => ({
      ...prevState,
      userSelectedData: removeSlectedData,
      userData: addRemoveUserData,
    }));
  };

  let history = useHistory();

  const handleSubmit = () => {
    setState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));
    let userSelectedData = state.userSelectedData.map((n) => n.username);
    const data = {
      message: state.message,
      subject: state.subject,
      title: state.title,
      mode: {
        sms: preferencesNumberReturn(state.sms),
        email: preferencesNumberReturn(state.email),
        inapp: preferencesNumberReturn(state.inapp),
        push: preferencesNumberReturn(state.push),
      },
      users: userSelectedData,
    };
    console.log("data", data);
    apipostUrl(`/notify/send`, data)
      .then((res) => {
        console.log("Result", res);

        if (`${res.data.responseCode}` === "200") {
          getSuccessUpdate(res);
          setTimeout(() => {
            history.push("/app/widgets/UserNotifications");
            setState((prevState) => ({
              ...prevState,
              isLoading: true,
            }));
          }, 2000);
        }
        if (`${res.data.status}` === "500") {
          ippNotify.error(res.data.error);
          showLoader();
        }
        if (`${res.data.responseStatus}` === "failure") {
          ippNotify.error(res.data.responseMessage);
          showLoader();
        }
      })
      .catch((err) => {
        ippNotify.error(err.data.responseMessage);
        showLoader();
      });
  };

  const showLoader = () => {
    setTimeout(() => {
      setState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }, 5000);
  };

  const getSuccessUpdate = (res) => {
    ippNotify.success(res.data.responseMessage);
  };

  const preferencesNumberReturn = (preferences) => {
    switch (preferences) {
      case true:
        return "Y";
      case false:
        return "N";
      case "":
        return "";
    }
  };

  useEffect(() => {
    if (state.isCheck && state.isMessage && state.isSubject && state.isTitle) {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: true,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        isAddFormSubmitDisabled: false,
      }));
    }
  }, [state.isCheck, state.isMessage, state.isSubject, state.isTitle]);

  const multiLineStyling_UseStyles = makeStyles((theme) => ({
    textarea: {
      resize: "both",
    },
  }));

  const multiLineStyling_Classes = multiLineStyling_UseStyles();
  return (
    <>
      {state.isLoading ? <Loader /> : null}
      <div className="App">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4"></div>
          <div className="col-lg-4">
            <IPPNotification />
          </div>
        </div>
        <CardBox styleName="col-md-12">
          <div className="cardBox">
            <div className="row">
              <div className="col-lg-6">
                <TextField
                  variant="outlined"
                  multiline
                  className="mb-3 p-0"
                  autoFocus
                  id="message"
                  label="Message"
                  inputProps={{
                    className: multiLineStyling_Classes.textarea,
                  }}
                  name="message"
                  onChange={(e) => handleMessageAddFormChange(e)}
                  value={state.message}
                  helperText={
                    state.isMessageFieldActive
                      ? "Language Content is Required"
                      : null
                  }
                  error={state.isMessageFieldActive}
                  fullWidth
                />
              </div>
              <div className="col-lg-6 ml-0">
                <Paper
                  className="pb-2  paper"
                  elevation={3}
                  style={{ height: "80px" }}
                >
                  <FormControl component="fieldset">
                    <FormLabel
                      className="pl-2 mb-4"
                      component="legend"
                      id="modes"
                    >
                      <IntlMessages id="UserNotification.mode" />
                    </FormLabel>
                    <FormGroup className="paper-form" row>
                      <FormControlLabel
                        className="mr-0 mb-4"
                        label={
                          <IntlMessages id="notificationdetails.master.modal.edit.felid.SMS" />
                        }
                        name="sms"
                        control={
                          <Switch
                            color="primary"
                            checked={state.sms}
                            onClick={(e) => handleAddFormChange(e, "sms")}
                          />
                        }
                        labelPlacement="start"
                      />

                      <FormControlLabel
                        className="mr-0 mb-4"
                        label={
                          <IntlMessages id="notificationdetails.master.modal.edit.felid.Email" />
                        }
                        name="email"
                        control={
                          <Switch
                            color="primary"
                            checked={state.email}
                            onChange={(e) => handleAddFormChange(e)}
                          />
                        }
                        labelPlacement="start"
                      />

                      <FormControlLabel
                        className="mr-0 mb-4"
                        label={
                          <IntlMessages id="notificationdetails.master.modal.edit.felid.Push" />
                        }
                        name="push"
                        control={
                          <Switch
                            color="primary"
                            checked={state.push}
                            onChange={(e) => handleAddFormChange(e)}
                          />
                        }
                        labelPlacement="start"
                      />
                      <FormControlLabel
                        className="mr-0 mb-4"
                        label={
                          <IntlMessages id="notificationdetails.master.modal.edit.felid.InApp" />
                        }
                        name="inapp"
                        control={
                          <Switch
                            color="primary"
                            checked={state.inapp}
                            onChange={(e) => handleAddFormChange(e)}
                          />
                        }
                        labelPlacement="start"
                      />
                    </FormGroup>
                  </FormControl>
                </Paper>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <InputField
                  error={state.isSubjectFieldActive}
                  className="mb-3"
                  autoFocus
                  id="subject"
                  label={<IntlMessages id="UserNotification.subject" />}
                  name="subject"
                  onChange={(e) => handleSubjectAddFormChange(e)}
                  value={state.subject}
                  helperText={
                    state.isSubjectFieldActive ? "Subject is Required" : null
                  }
                  fullWidth
                />
              </div>
              <div className="col-lg-6">
                <InputField
                  error={state.isTitleFieldActive}
                  helperText={
                    state.isTitleFieldActive ? "Title is Required" : null
                  }
                  className="mb-3"
                  autoFocus
                  id="title"
                  label={<IntlMessages id="UserNotification.title" />}
                  name="title"
                  onChange={(e) => handleTitleAddFormChange(e)}
                  value={state.title}
                  fullWidth
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-lg-6">
                <Autocomplete
                  id="role"
                  name="role"
                  onChange={(e, value) => handleRoleChange(e, value)}
                  options={(state.roleData || []).map((n) => n.name)}
                  // getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={<IntlMessages id="UserNotification.roles" />}
                      placeholder="Role List"
                    />
                  )}
                />
              </div>

              <div className="col-lg-6">
                {state.isRoleActive ? (
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    onClick={handleAllUser}
                    startIcon={<AddIcon />}
                  >
                    <IntlMessages id="UserNotification.alluser" />
                  </Button>
                ) : (
                  <Button
                    size="large"
                    variant="contained"
                    color="secondary"
                    disabled
                    startIcon={<AddIcon />}
                  >
                    <IntlMessages id="UserNotification.alluser" />
                  </Button>
                )}
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-6">
                <Autocomplete
                  multiple
                  limitTags={0}
                  id="role"
                  name="role"
                  onChange={(e, value) => handleUserChange(e, value)}
                  options={state.userData}
                  getOptionLabel={(option) => option.username}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={<IntlMessages id="UserNotification.users" />}
                      placeholder="User List"
                    />
                  )}
                />
              </div>
              <div className="col-lg-6">
                {state.isUserChangeActive ? (
                  <InputAddButton size="large" onClick={handleAdd} />
                ) : (
                  <InputAddButton size="large" onClick={handleAdd} disabled />
                )}
              </div>
            </div>
            {(state.userSelectedData.length >= 1 && state.isUserActive) ||
            (state.userSelectedData.length >= 1 && state.isallUserActive) ? (
              <>
                <div
                  className="row mt-5"
                  style={{
                    border: "1px solid black",
                    width: "50%",
                    marginLeft: "25%",
                  }}
                >
                  <FieldArea
                    userSelectedData={state.userSelectedData}
                    handleDelete={handleDelete}
                  />
                </div>
                <div className="row mt-5" style={{ marginLeft: "45%" }}>
                  <InputSubmitButton
                    size="large"
                    onClick={handleSubmit}
                    disabled={!state.isAddFormSubmitDisabled}
                  />
                </div>
              </>
            ) : null}
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default App;
