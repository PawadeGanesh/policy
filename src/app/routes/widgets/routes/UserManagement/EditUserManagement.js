import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import Joi from "joi-browser";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import LocationFilter from "../CommonComponents/LocationFilter";
import { apigetUrl, apiputUrl } from "../../../../../setup/middleware";
import InputMultiSelectAutocomplete from "../CommonComponents/MultiSelectAutoComplete";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

const schema = {
  firstname: Joi.string()
    .required()
    .label("firstname"),
  middlename: Joi.string()
    .required()
    .label("middlename"),
  lastname: Joi.string()
    .required()
    .label("lastname"),
  mobileno: Joi.string()
    .required()
    .label("mobileno"),
  emailid: Joi.string()
    .required()
    .label("emailid"),

  username: Joi.string()
    .required()
    .label("username"),
  role: Joi.string()
    .required()
    .label("role"),
  newpassword: Joi.string()
    .required()
    .label("newpassword"),
  confrimationpassword: Joi.string()
    .required()
    .label("confrimationpassword"),
};

const EditUserManagement = ({
  getEditSuccessUpdate,
  getEditErrorUpdate,
  closeEditUserManagement,
  callLocalBaseURL,
  selectedId,
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
    location1: "",
    location2: "",
    location3: "",
    location4: "",
    keylockid: "",
    locationId: [],
    roleData: [],
    roleFilterData: [],
    isSubmitButtonDisabled: true,
  });

  let roleString = "";
  let roleStringData = [];
  const dispatch = useDispatch();

  useEffect(() => {
    callRoleApi();
  }, []);

  //Call RoleApi
  const callRoleApi = async () => {
    const result = await apigetUrl(`/auth/login/roles?page=1&limit=1000`);
    if (result.data.responseCode === "200") {
      let role = result.data.dataList;
      for (var i = 0; i < role.length; i++) {
        roleStringData.push(role[i]);
      }
      setState((prevState) => ({
        ...prevState,
        roleData: role,
      }));
    }
    getUserDetails();
  };

  //get User Details
  const getUserDetails = async () => {
    const result = await apigetUrl(`/auth/users/${selectedId}`);
    if (result.data.responseCode === "200") {
      let inputdata = result.data.locationDto;
      let level1 = parseInt(inputdata.level1Id);
      let level2 = parseInt(inputdata.level2Id);
      let level3 = parseInt(inputdata.level3Id);
      let level4 = parseInt(inputdata.level4Id);
      let defaultlevel = 1;
      let levels = Object.values(inputdata);
      let locationarray = new Array(
        defaultlevel,
        level4,
        level3,
        level2,
        level1
      );
      let rolename = result.data.roles;
      let ourSubstring = ",";
      let data = roleStringData;
      let arrayData = [];
      if (rolename.includes(ourSubstring)) {
        var roleArray = rolename.split(", ");
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < roleArray.length; j++) {
            if (roleArray[j] === data[i].roleId) {
              arrayData.push(data[i]);
            }
          }
        }
      } else {
        for (var i = 0; i < data.length; i++) {
          if (rolename === data[i].roleId) {
            arrayData.push(data[i]);
          }
        }
      }

      setState((prevState) => ({
        ...prevState,
        firstname: result.data.firstName,
        lastname: result.data.lastName,
        mobileno: parseInt(result.data.mobileNumber),
        emailid: result.data.email,
        username: result.data.username,
        keylockid: result.data.keyCloakId,
        locationId: locationarray,
        location4: level4.toString(),
        location3: level3.toString(),
        location2: level2.toString(),
        location1: level1.toString(),
        roleFilterData: arrayData,
      }));
    } else {
    }
  };

  //handle submit
  const handleSubmit = (e) => {
    if (
      state.username != "" &&
      state.firstname != "" &&
      state.lastname != "" &&
      state.mobileno != "" &&
      state.emailid != "" &&
      state.roleFilterData.length > 0
    ) {
      addBackenddata();
    } else {
      ippNotify.error(
        <IntlMessages id="UserManagement.master.add.defaulterror" />
      );
    }
  };

  //submit data
  const addBackenddata = async () => {
    roleFilterString();
    let addDataObj = {
      firstName: state.firstname,
      lastName: state.lastname,
      email: state.emailid,
      mobileNumber: parseInt(state.mobileno),
      roles: roleString,
      locationDto: {
        level1Id: state.location1,
        level2Id: state.location2,
        level3Id: state.location3,
        level4Id: state.location4,
      },
    };
    const result = await apiputUrl(`/auth/users/${selectedId}`, addDataObj);
    if (result.data.responseCode === "200") {
      closeEditUserManagement();
      getEditSuccessUpdate();
      callLocalBaseURL();
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        getEditErrorUpdate(result);
      }
    }
  };

  //Role Change
  const handleRoleChange = (e, value, reason) => {
    let arrayData = [];
    if (reason === "remove-option") {
      for (let i = 0; i < value.length; i++) {
        arrayData.push(value[i]);
      }
    } else if (reason === "select-option" || reason === "create-option") {
      for (let i = 0; i < value.length; i++) {
        let valueData = value[i].name;
        let role = valueData;

        if (state.roleFilterData.length == 0) {
          arrayData.push(value[i]);
        } else {
          arrayData = state.roleFilterData;
          for (var j = 0; j < value.length; j++) {
            var unique = "Yes";
            for (var z = 0; z < arrayData.length; z++) {
              if (arrayData[z].roleId === value[j].roleId) {
                unique = "No";
              }
            }
            if (unique == "Yes") {
              arrayData.push(value[j]);
            }
          }
        }
      }
    }
    setState((prevState) => ({
      ...prevState,
      roleFilterData: arrayData,
      isSubmitButtonDisabled: false,
    }));
  };

  //Role Filter
  const roleFilterString = () => {
    let roleDetails = state.roleFilterData;
    for (var i = 0; i < roleDetails.length; i++) {
      if (roleString === "") {
        roleString = roleDetails[i].roleId;
      } else {
        roleString = roleString + "," + roleDetails[i].roleId;
      }
    }
  };

  //handle First Name
  const handleChangeFirstName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      firstname: value,
      isSubmitButtonDisabled: false,
    }));
  };

  //handle Last Name
  const handleChangeLastName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      lastname: value,
      isSubmitButtonDisabled: false,
    }));
  };

  //handle Email Id
  const handleChangeEmailId = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      emailid: value,
      isSubmitButtonDisabled: false,
    }));
  };

  //handle mobile number
  const handleChangeMobile = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      mobileno: value,
      isSubmitButtonDisabled: false,
    }));
  };

  //handle username
  const handleUserName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      username: value,
      isSubmitButtonDisabled: false,
    }));
  };

  //handle location
  const handler = (id, value) => {
    let valueId = id.toString();
    let valueName = value.toLowerCase();
    if (valueName === "zone") {
      setState((prevState) => ({
        ...prevState,
        location4: valueId,
        isSubmitButtonDisabled: false,
      }));
    } else if (valueName === "state") {
      setState((prevState) => ({
        ...prevState,
        location3: valueId,
        isSubmitButtonDisabled: false,
      }));
    } else if (valueName === "cluster") {
      setState((prevState) => ({
        ...prevState,
        location2: valueId,
        isSubmitButtonDisabled: false,
      }));
    } else if (valueName === "district") {
      setState((prevState) => ({
        ...prevState,
        location1: valueId,
        isSubmitButtonDisabled: false,
      }));
    }
  };

  return (
    <div className="row">
      <CardBox styleName="col-md-12">
        <div className="cardBox">
          <div className="row">
            <div className="col-lg-6">
              <InputField
                required
                className="mb-4 disabledtextbox"
                id="username"
                label={
                  <IntlMessages id="UserManagement.master.edit.username" />
                }
                name="username"
                value={state.username}
                fullWidth
                //onChange={(e) => handleUserName(e)}
                error={state.errors.name}
                helperText={state.errors.name}
              />
            </div>

            <div className="col-lg-6">
              <InputMultiSelectAutocomplete
                value={state.roleFilterData}
                onChange={(e, value, reason) =>
                  handleRoleChange(e, value, reason)
                }
                options={state.roleData}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Role *"
                  />
                )}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <InputField
                required
                className="mb-4"
                autoFocus
                id="firstname"
                label={
                  <IntlMessages id="UserManagement.master.add.firstname" />
                }
                name="firstname"
                onChange={(e) => handleChangeFirstName(e)}
                value={state.firstname}
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
                label={
                  <IntlMessages id="UserManagement.master.edit.lastname" />
                }
                name="lastname"
                value={state.lastname}
                fullWidth
                onChange={(e) => handleChangeLastName(e)}
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
                label={
                  <IntlMessages id="UserManagement.master.edit.mobileno" />
                }
                name="mobileno"
                type="number"
                value={state.mobileno}
                onChange={(e) => handleChangeMobile(e)}
                fullWidth
                error={state.errors.kafkaTopic}
                helperText={state.errors.kafkaTopic}
              />
            </div>
            <div className="col-lg-6">
              <InputField
                required
                className="mb-4"
                onChange={(e) => handleChangeEmailId(e)}
                id="emailid"
                label={<IntlMessages id="UserManagement.master.edit.emailid" />}
                name="emailid"
                value={state.emailid}
                fullWidth
                error={state.errors.name}
                helperText={state.errors.name}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <LocationFilter handler={handler} inputId={state.locationId} />
            </div>
          </div>

          <div className="text-center">
            <div className="row">
              <br></br>
            </div>
            <InputCancelButton onClick={(e) => closeEditUserManagement(e)} />
            <InputSubmitButton
              onClick={(e) => handleSubmit(e)}
              disabled={state.isSubmitButtonDisabled}
            />
          </div>

          {state.err && (
            <FormHelperText error={Boolean(state.err)}>
              {state.err.responseMessage}
            </FormHelperText>
          )}
          <IPPNotification />
        </div>
      </CardBox>
    </div>
  );
};

export default EditUserManagement;
