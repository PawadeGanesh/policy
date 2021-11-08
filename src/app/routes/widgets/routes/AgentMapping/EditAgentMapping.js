import React, { useState, useEffect, useRef } from "react";
import IntlMessages from "util/IntlMessages";
import CardBox from "./../../../../../components/CardBox";
import "./master.css";
import InputSubmitButton from "../CommonComponents/SubmitButton";
import InputCancelButton from "../CommonComponents/CancelButton";
import InputField from "../CommonComponents/TextField";
import {
  IPPNotification,
  ippNotify,
} from "../CommonComponents/IPPNotification";
import LocationHierarchy from "../CommonComponents/LocationHierarchy";
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
} from "../../../../../setup/middleware";

const EditAgentMapping = ({
  getEditSuccessUpdate,
  getEditErrorUpdate,
  closeEditRoCAgent,
  callLocalBaseURL,
  selectedId,
  keyclockid,
}) => {
  const [state, setState] = useState({
    activeStep: 0,
    firstname: "",
    lastname: "",
    mobileno: 0,
    emailid: "",
    isactivefirstname: true,
    isactivelastname: true,
    isactivemobileno: true,
    isactiveemailid: true,
    error: "",
    errors: {},
    isactive: false,
    location1: [],
    location2: [],
    location3: [],
    location4: [],
    keylockid: "",
    locationId: [],
    method: "",
    isEditActive: false,
  });

  useEffect(() => {
    getAgentDetails();
    checkForLocationDetails();
  }, []);

  //get agent details
  const getAgentDetails = async () => {
    const result = await apigetUrl(`/auth/users/${keyclockid}`);
    if (result.data.responseCode === "200") {
      setState((prevState) => ({
        ...prevState,
        firstname: result.data.firstName,
        lastname: result.data.lastName,
        mobileno: parseInt(result.data.mobileNumber),
        emailid: result.data.email,
        username: result.data.username,
      }));
    }
  };

  //check for location details
  const checkForLocationDetails = async () => {
    const result = await apigetUrl(
      `/insurance/agent/region-mapping/${selectedId}`
    );
    if (result.status === 200) {
      let setMethod = "put";
      setState((prevState) => ({
        ...prevState,
        method: setMethod,
      }));
      getLocationDetails(result);
    } else {
      let setMethod = "post";
      setState((prevState) => ({
        ...prevState,
        method: setMethod,
      }));
    }
  };

  //load location details
  const getLocationDetails = (result) => {
    let inputdata = result.data.locationHierarchy;
    let level1 = [];
    let level2 = [];
    let level3 = [];
    let level4 = [];
    let level1data = [];
    let level2data = [];
    let level3data = [];
    let level4data = [];
    let level1Data = inputdata.level1Id;
    for (var i = 0; i < level1Data.length; i++) {
      level1.push(parseInt(level1Data[i]));
      level1data.push(level1Data[i]);
    }
    let level2Data = inputdata.level2Id;
    for (var i = 0; i < level2Data.length; i++) {
      level2.push(parseInt(level2Data[i]));
      level2data.push(level2Data[i]);
    }
    let level3Data = inputdata.level3Id;
    for (var i = 0; i < level3Data.length; i++) {
      level3.push(parseInt(level3Data[i]));
      level3data.push(level3Data[i]);
    }
    let level4Data = inputdata.level4Id;
    for (var i = 0; i < level4Data.length; i++) {
      level4.push(parseInt(level4Data[i]));
      level4data.push(level4Data[i]);
    }
    let defaultlevel = 1;
    let locationarray = new Array(defaultlevel, level4, level3, level2, level1);
    setState((prevState) => ({
      ...prevState,
      locationId: locationarray,
      location1: level1data,
      location2: level2data,
      location3: level3data,
      location4: level4data,
    }));
  };

  //load location filter function
  const handler = (id, value) => {
    let valueId = id.toString();
    let valueData = value.toLowerCase();
    if (valueData === "zone") {
      let unqiue = true;
      let location4data = state.location4;
      if (location4data.length === 0) {
        location4data.push(valueId);
      } else {
        for (var i = 0; i < location4data.length; i++) {
          if (location4data[i] === valueId) {
            unqiue = false;
          }
        }
        if (unqiue === true) {
          location4data.push(valueId);
        }
      }

      setState((prevState) => ({
        ...prevState,
        location4: location4data,
      }));
    } else if (valueData === "state") {
      let unqiue = true;
      let location3data = state.location3;
      if (location3data.length === 0) {
        location3data.push(valueId);
      } else {
        for (var i = 0; i < location3data.length; i++) {
          if (location3data[i] === valueId) {
            unqiue = false;
          }
        }
        if (unqiue === true) {
          location3data.push(valueId);
        }
      }

      setState((prevState) => ({
        ...prevState,
        location3: location3data,
      }));
    } else if (valueData === "cluster") {
      let unqiue = true;
      let location2data = state.location2;
      if (location2data.length === 0) {
        location2data.push(valueId);
      } else {
        for (var i = 0; i < location2data.length; i++) {
          if (location2data[i] === valueId) {
            unqiue = false;
          }
        }
        if (unqiue === true) {
          location2data.push(valueId);
        }
      }
      setState((prevState) => ({
        ...prevState,
        location2: location2data,
      }));
    } else if (valueData === "district") {
      let unqiue = true;
      let arrayData = [];
      let location1data = state.location1;
      if (location1data.length === 0) {
        location1data.push(valueId);
      } else {
        for (var i = 0; i < location1data.length; i++) {
          if (location1data[i] === valueId) {
            unqiue = false;
          }
        }
        if (unqiue === true) {
          location1data.push(valueId);
        }
      }

      setState((prevState) => ({
        ...prevState,
        location1: location1data,
      }));
    }
  };

  //handle submit
  const handleSubmit = () => {
    if (state.method === "put") {
      updateRoCMapping();
    } else if (state.method === "post") {
      addRoCMapping();
    }
  };

  //add functionality
  const addRoCMapping = async () => {
    let addDataObj = {
      agentId: selectedId,
      locationHierarchy: {
        level1Id: state.location1,
        level2Id: state.location2,
        level3Id: state.location3,
        level4Id: state.location4,
      },
    };
    const result = await apipostUrl(
      `/insurance/agent/region-mapping`,
      addDataObj
    );
    if (result.data.responseCode === "200") {
      closeEditRoCAgent();
      callLocalBaseURL();
      getEditSuccessUpdate();
    } else {
      closeEditRoCAgent();
      callLocalBaseURL();
      getEditErrorUpdate(result);
    }
  };

  //edit functionality
  const updateRoCMapping = async () => {
    let addDataObj = {
      locationHierarchy: {
        level1Id: state.location1,
        level2Id: state.location2,
        level3Id: state.location3,
        level4Id: state.location4,
      },
    };
    const result = await apiputUrl(
      `/insurance/agent/region-mapping/${selectedId}`,
      addDataObj
    );
    if (result.data.responseCode === "200") {
      closeEditRoCAgent();
      callLocalBaseURL();
      getEditSuccessUpdate();
    } else {
      closeEditRoCAgent();
      callLocalBaseURL();
      getEditErrorUpdate(result);
    }
  };

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
                  label={<IntlMessages id="RoCAgent.master.edit.firstname" />}
                  name="firstname"
                  disabled={state.isactivefirstname}
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
                  label={<IntlMessages id="RoCAgent.master.edit.lastname" />}
                  name="lastname"
                  value={state.lastname}
                  fullWidth
                  disabled={state.isactivelastname}
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
                  label={<IntlMessages id="RoCAgent.master.edit.mobileno" />}
                  name="mobileno"
                  type="number"
                  value={state.mobileno}
                  disabled={state.isactivemobileno}
                  fullWidth
                  error={state.errors.kafkaTopic}
                  helperText={state.errors.kafkaTopic}
                />
              </div>
              <div className="col-lg-6">
                <InputField
                  required
                  className="mb-4"
                  id="emailid"
                  label={<IntlMessages id="RoCAgent.master.edit.emailid" />}
                  name="emailid"
                  value={state.emailid}
                  disabled={state.isactiveemailid}
                  fullWidth
                  error={state.errors.name}
                  helperText={state.errors.name}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-12">
                <LocationHierarchy
                  handler={handler}
                  inputId={state.locationId}
                  isActive={state.isActive}
                />
              </div>
            </div>

            <div className="text-center">
              <div className="row">
                <br></br>
              </div>
              <InputCancelButton onClick={(e) => closeEditRoCAgent(e)} />
              <InputSubmitButton onClick={(e) => handleSubmit(e)} />
            </div>
            <IPPNotification />
          </div>
        </CardBox>
      </div>
    </>
  );
};

export default EditAgentMapping;
