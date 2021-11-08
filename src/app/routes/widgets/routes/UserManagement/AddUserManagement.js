import React, { useState, useEffect, useRef } from "react";
import { TextField } from "@material-ui/core";
import IntlMessages from "util/IntlMessages";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardBox from "./../../../../../components/CardBox";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import LocationFilter from "../CommonComponents/LocationFilter";
import { apigetUrl, apipostUrl } from "../../../../../setup/middleware";
import InputMultiSelectAutocomplete from "../CommonComponents/MultiSelectAutoComplete";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { verifyToken } from "../../../../../actions/Auth";

const AddUserManagement = ({
  getSuccessUpdate,
  getErrorUpdate,
  closeAddUserManagement,
  callLocalBaseURL,
}) => {
  const { authUser } = useSelector(({ auth }) => auth);
  const [state, setState] = useState({
    firstname: "",
    lastname: "",
    mobileno: 0,
    emailid: "",
    username: "",
    error: "",
    errors: {},
    isactive: false,
    location1: "",
    location2: "",
    location3: "",
    location4: "",
    passwordExpression: "",
    roleData: [],
    roleFilterData: [],
  });

  let roleString = "";
  const dispatch = useDispatch();

  useEffect(() => {
    let locationArray = authUser && authUser.locationFilters;
    for (var i = 0; i < locationArray.length; i++) {
      if (locationArray[i].fixed === true) {
        let valueId = locationArray[i].defaultId.toString();
        let valueName = locationArray[i].levelName.toLowerCase();
        if (valueName === "zone") {
          setState((prevState) => ({
            ...prevState,
            location4: valueId,
          }));
        } else if (valueName === "state") {
          setState((prevState) => ({
            ...prevState,
            location3: valueId,
          }));
        } else if (valueName === "cluster") {
          setState((prevState) => ({
            ...prevState,
            location2: valueId,
          }));
        } else if (valueName === "district") {
          setState((prevState) => ({
            ...prevState,
            location1: valueId,
          }));
        }
      }
    }
    callRoleApi();
  }, []);

  //Call RoleApi
  const callRoleApi = async () => {
    const result = await apigetUrl(`/auth/login/roles?page=1&limit=1000`);
    if (result.data.responseCode === "200") {
      let role = result.data.dataList;
      setState((prevState) => ({
        ...prevState,
        roleData: role,
      }));
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
    }));
  };

  //Role Filter
  const roleFilterString = () => {
    let roleDetails = state.roleFilterData;
    for (var i = 0; i < roleDetails.length; i++) {
      if (roleString === "") {
        roleString = roleDetails[i].id;
      } else {
        roleString = roleString + "," + roleDetails[i].id;
      }
    }
  };

  //Handle Submit
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

  //Submit Data To Backend
  const addBackenddata = async () => {
    roleFilterString();
    let addDataObj = {
      username: state.username,
      firstName: state.firstname,
      lastName: state.lastname,
      email: state.emailid,
      roles: roleString,
      mobileNumber: parseInt(state.mobileno),
      locationDto: {
        level1Id: state.location1,
        level2Id: state.location2,
        level3Id: state.location3,
        level4Id: state.location4,
      },
    };
    const result = await apipostUrl(`/auth/users`, addDataObj);
    if (
      result.data.responseCode === "200" ||
      result.data.responseCode === "201"
    ) {
      closeAddUserManagement();
      getSuccessUpdate();
      callLocalBaseURL();
    } else {
      if (result.status === 401 || result.status === 402) {
        dispatch(verifyToken());
      } else {
        getErrorUpdate(result);
      }
    }
  };

  //Handle First Name
  const handleChangeFirstName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      firstname: value,
    }));
  };

  //Handle Last Name
  const handleChangeLastName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      lastname: value,
    }));
  };

  //Handle Email Id
  const handleChangeEmailId = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      emailid: value,
    }));
  };

  //Handle Mobile
  const handleChangeMobile = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      mobileno: value,
    }));
  };

  //Handle Username
  const handleUserName = (e) => {
    let value = e.target.value;
    setState((prevState) => ({
      ...prevState,
      username: value,
    }));
  };

  //Location Filter
  const handler = (id, value) => {
    let valueId = id.toString();
    let valueName = value.toLowerCase();
    if (valueName === "zone") {
      setState((prevState) => ({
        ...prevState,
        location4: valueId,
      }));
    } else if (valueName === "state") {
      setState((prevState) => ({
        ...prevState,
        location3: valueId,
      }));
    } else if (valueName === "cluster") {
      setState((prevState) => ({
        ...prevState,
        location2: valueId,
      }));
    } else if (valueName === "district") {
      setState((prevState) => ({
        ...prevState,
        location1: valueId,
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
                autoFocus
                className="mb-4"
                id="username"
                label={<IntlMessages id="UserManagement.master.add.username" />}
                name="username"
                value={state.username}
                fullWidth
                onChange={(e) => handleUserName(e)}
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
                label={<IntlMessages id="UserManagement.master.add.lastname" />}
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
                label={<IntlMessages id="UserManagement.master.add.mobileno" />}
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
                label={<IntlMessages id="UserManagement.master.add.emailid" />}
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
              <LocationFilter handler={handler} />
            </div>
          </div>
          <div className="text-center">
            <div className="row">
              <br></br>
            </div>
            <InputCancelButton onClick={(e) => closeAddUserManagement(e)} />
            <InputSubmitButton onClick={(e) => handleSubmit(e)} />
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

export default AddUserManagement;
