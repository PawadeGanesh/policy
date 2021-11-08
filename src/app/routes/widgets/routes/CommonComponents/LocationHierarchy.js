import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import apiInstance from "setup";
import { apigetUrl } from "setup/middleware";
import InputSelect from "app/routes/widgets/routes/CommonComponents/Select";
import { resolve } from "joi-browser";
import Checkbox from "@material-ui/core/Checkbox";
import CardBox from "./../../../../../components/CardBox";
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

import InputMultiSelectAutocomplete from "../CommonComponents/MultiSelectAutoComplete";
import { icons } from "react-icons/lib/cjs/iconsManifest";

const LocationHierarchy = ({
  handler,
  inputId,
  isActive,
  handlingDefaultValue,
  isEditActive,
}) => {
  const { authUser } = useSelector(({ auth }) => auth);
  const [state, setState] = useState({
    data: [],
    userId: "",
    location1: "",
    location2: "",
    location3: "",
    location4: "",
    location5: "",
    location6: "",
    levelName: "",
    locationName: [],
    locationData: [],
    location1Data: [],
    location2Data: [],
    location3Data: [],
    nextLocationName: [],
    nextLocationName1: [],
    nextLocationName2: [],
    nextLocationName3: [],
    nextLocationName4: [],
    nextLocationName5: [],
    lastValue: "",
    falseData: [],
    trueData: [],
    isActive: false,
    locationHierarchyValue: 0,
    locationHierarchyZone: true,
    locationHierarchyState: true,
    locationHierarchyCluster: true,
    locationHierarchyDistrict: true,
    getLocation1Array: [],
    getLocation2Array: [],
    getLocation3Array: [],
    levelDropDown: [],
  });

  useEffect(() => {
    let dataArray = authUser && authUser.locationFilters;
    let data = [];
    let dataDropDown = [];
    for (var i = 0; i < dataArray.length; i++) {
      data.push({
        levelName: dataArray[i].levelName,
        fixed: false,
      });
      dataDropDown.push({
        level: dataArray[i].levelName,
        id: dataArray[i].defaultId,
      });
    }
    let userId = (authUser.userDetails || {}).username;
    data = data || [];
    let levelName = data.map((n) => n.levelName);
    let lastValue = data.filter((n) => n.fixed === false).slice(-1)[0];

    if (data.filter((n) => n.fixed === true).length === 0) {
      let id = 1;
      getLocation(id);
    } else {
      let firstValue = data.filter((n) => n.fixed === true)[0];
      let id = firstValue.defaultId;
      getLocation(id);
    }

    let falseData = data.filter((n) => n.fixed === false);
    let trueData = data.filter((n) => n.fixed === true);

    setState((prevState) => ({
      ...prevState,
      userId: userId,
      data: data,
      falseData: falseData,
      trueData: trueData,
      lastValue: lastValue,
      levelDropDown: dataDropDown,
      locationHierarchyValue: dataDropDown[0].id || "",
    }));
  }, []);

  //   //load location 1
  const getLocation = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let locationName = res.data.dataList;

        setState((prevState) => ({
          ...prevState,
          location1: "All Zones",
          locationName: locationName,
        }));
      }
    );
  };

  const removeRegionalArea = (e, value, levelName, reason, DropdownName) => {
    if (value.length === 0) {
      let valueData = "";
      if (
        value.name === "" ||
        value.name === undefined ||
        value.name === null
      ) {
        valueData = "";
      } else {
        valueData = value.name;
      }
      if (valueData === levelName) {
        handlingDefaultValue(e);
      }

      if (levelName === state.falseData.slice(0).reverse()[0].levelName) {
        state.nextLocationName.length = 0;
        state.getLocation1Array.length = 0;
        setState((prevState) => ({
          ...prevState,
          location1: valueData,
          locationData: [],
          location2: "All States",
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else if (
        levelName === state.falseData.slice(0).reverse()[1].levelName
      ) {
        state.nextLocationName1.length = 0;
        state.getLocation2Array.length = 0;
        setState((prevState) => ({
          ...prevState,
          location2: valueData,
          location1Data: [],
          location3: "All Clusters",
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else if (
        levelName === state.falseData.slice(0).reverse()[2].levelName
      ) {
        state.nextLocationName2.length = 0;
        state.getLocation3Array.length = 0;
        setState((prevState) => ({
          ...prevState,
          location3: valueData,
          location2Data: [],
          location4: "All Districts",
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else if (
        levelName === state.falseData.slice(0).reverse()[3].levelName
      ) {
        state.nextLocationName3.length = 0;
        setState((prevState) => ({
          ...prevState,
          location4: valueData,
          location3Data: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else if (
        levelName === state.falseData.slice(0).reverse()[4].levelName
      ) {
        state.nextLocationName4.length = 0;
        let location5 = valueData;
        setState((prevState) => ({
          ...prevState,
          location5: valueData,
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else if (
        levelName === state.falseData.slice(0).reverse()[5].levelName
      ) {
        state.nextLocationName5.length = 0;
        let location6 = valueData;
        setState((prevState) => ({
          ...prevState,
          location6: valueData,
          nextLocationName5: [],
        }));
      }
    } else {
      if (levelName === state.falseData.slice(0).reverse()[0].levelName) {
        state.nextLocationName.length = 0;
        state.getLocation1Array.length = 0;
        state.locationData.length = 0;
      } else if (
        levelName === state.falseData.slice(0).reverse()[1].levelName
      ) {
        state.nextLocationName1.length = 0;
        state.getLocation2Array.length = 0;
        state.location1Data.length = 0;
      } else if (
        levelName === state.falseData.slice(0).reverse()[2].levelName
      ) {
        state.nextLocationName2.length = 0;
        state.getLocation3Array.length = 0;
        state.location2Data.length = 0;
      } else if (
        levelName === state.falseData.slice(0).reverse()[3].levelName
      ) {
        state.nextLocationName3.length = 0;
        state.location3Data.length = 0;
      } else if (
        levelName === state.falseData.slice(0).reverse()[4].levelName
      ) {
        state.nextLocationName4.length = 0;
      } else if (
        levelName === state.falseData.slice(0).reverse()[5].levelName
      ) {
        state.nextLocationName5.length = 0;
      }

      for (let i = 0; i < value.length; i++) {
        let valueData = value[i].name;
        if (valueData === levelName) {
          handlingDefaultValue(e);
        }

        if (levelName === state.falseData.slice(0).reverse()[0].levelName) {
          let location1 = valueData;
          let arrayData = [];
          if (state.locationData.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.locationData;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location1: location1,
            locationData: arrayData,
          }));

          const searchId = state.locationName.find((n) => n.name === valueData);
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation1(setId);
            setState((prevState) => ({
              ...prevState,
              location2: "All States",
              nextLocationName: [],
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              location2: "All States",
              nextLocationName: [],
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[1].levelName
        ) {
          let location2 = valueData;
          let arrayData = [];
          if (state.location1Data.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.location1Data;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location2: location2 || null,
            location1Data: arrayData,
          }));

          const searchId = state.nextLocationName.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation2(setId);
            setState((prevState) => ({
              ...prevState,
              location3: "All Clusters",
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              location3: "All Clusters",
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[2].levelName
        ) {
          let location3 = valueData;
          let arrayData = [];
          if (state.location2Data.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.location2Data;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location3: location3 || null,
            location2Data: arrayData,
          }));
          const searchId = state.nextLocationName1.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation3(setId);
            setState((prevState) => ({
              ...prevState,
              location4: "All Districts",
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              location4: "All Districts",
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[3].levelName
        ) {
          let location4 = valueData;
          let arrayData = [];
          if (state.location3Data.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.location3Data;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location4: location4 || null,
            location3Data: arrayData,
          }));

          const searchId = state.nextLocationName2.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation4(setId);
            setState((prevState) => ({
              ...prevState,
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[4].levelName
        ) {
          let location5 = valueData;
          setState((prevState) => ({
            ...prevState,
            location5: location5 || "",
          }));

          const searchId = state.nextLocationName3.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation5(setId);
            setState((prevState) => ({
              ...prevState,
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[5].levelName
        ) {
          let location6 = valueData;
          setState((prevState) => ({
            ...prevState,
            location6: location6 || "",
          }));

          const searchId = state.nextLocationName4.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation6(setId);
            setState((prevState) => ({
              ...prevState,
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nextLocationName5: [],
            }));
          }
        }
      }
    }
  };

  //   //handle change for location
  const handleFalseChange = (e, value, levelName, reason, DropdownName) => {
    if (reason === "remove-option") {
      removeRegionalArea(e, value, levelName, reason, DropdownName);
    } else {
      for (let i = 0; i < value.length; i++) {
        let valueData = value[i].name;

        if (valueData === levelName) {
          handlingDefaultValue(e);
        }

        if (levelName === state.falseData.slice(0).reverse()[0].levelName) {
          let location1 = valueData;
          let arrayData = [];
          if (state.locationData.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.locationData;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location1: location1,
            locationData: arrayData,
          }));

          const searchId = state.locationName.find((n) => n.name === valueData);
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation1(setId);
            setState((prevState) => ({
              ...prevState,
              location2: "All States",
              nextLocationName: [],
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              location2: "All States",
              nextLocationName: [],
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[1].levelName
        ) {
          let location2 = valueData;
          let arrayData = [];
          if (state.location1Data.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.location1Data;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location2: location2 || null,
            location1Data: arrayData,
          }));

          const searchId = state.nextLocationName.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation2(setId);
            setState((prevState) => ({
              ...prevState,
              location3: "All Clusters",
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              location3: "All Clusters",
              nextLocationName1: [],
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[2].levelName
        ) {
          let location3 = valueData;
          let arrayData = [];
          if (state.location2Data.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.location2Data;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location3: location3 || null,
            location2Data: arrayData,
          }));
          const searchId = state.nextLocationName1.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation3(setId);
            setState((prevState) => ({
              ...prevState,
              location4: "All Districts",
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              location4: "All Districts",
              nextLocationName2: [],
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[3].levelName
        ) {
          let location4 = valueData;
          let arrayData = [];
          if (state.location3Data.length == 0) {
            arrayData.push(value[i]);
          } else {
            arrayData = state.location3Data;
            for (var j = 0; j < value.length; j++) {
              var unique = "Yes";
              for (var z = 0; z < arrayData.length; z++) {
                if (arrayData[z].id === value[j].id) {
                  unique = "No";
                }
              }
              if (unique == "Yes") {
                arrayData.push(value[j]);
              }
            }
          }
          setState((prevState) => ({
            ...prevState,
            location4: location4 || null,
            location3Data: arrayData,
          }));

          const searchId = state.nextLocationName2.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation4(setId);
            setState((prevState) => ({
              ...prevState,
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nextLocationName3: [],
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[4].levelName
        ) {
          let location5 = valueData;
          setState((prevState) => ({
            ...prevState,
            location5: location5 || "",
          }));

          const searchId = state.nextLocationName3.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation5(setId);
            setState((prevState) => ({
              ...prevState,
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nextLocationName4: [],
              nextLocationName5: [],
            }));
          }
        } else if (
          levelName === state.falseData.slice(0).reverse()[5].levelName
        ) {
          let location6 = valueData;
          setState((prevState) => ({
            ...prevState,
            location6: location6 || "",
          }));

          const searchId = state.nextLocationName4.find(
            (n) => n.name === valueData
          );
          if (searchId) {
            const setId = searchId.id;
            handler(setId, levelName);
            getLocation6(setId);
            setState((prevState) => ({
              ...prevState,
              nextLocationName5: [],
            }));
          } else {
            setState((prevState) => ({
              ...prevState,
              nextLocationName5: [],
            }));
          }
        }
      }
    }
  };

  //   //load location 2
  const getLocation1 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName = res.data.dataList;
        let arrayData = [];
        if (state.getLocation1Array.length === 0) {
          for (var j = 0; j < nextLocationName.length; j++) {
            arrayData.push(nextLocationName[j]);
          }
        } else {
          arrayData = state.getLocation1Array;
          for (var i = 0; i < nextLocationName.length; i++) {
            var unique = "Yes";
            for (var j = 0; j < arrayData.length; j++) {
              if (arrayData[j].id === nextLocationName[i].id) {
                unique = "No";
              }
            }
            if (unique == "Yes") {
              arrayData.push(nextLocationName[i]);
            }
          }
        }
        setState((prevState) => ({
          ...prevState,
          nextLocationName: arrayData,
          getLocation1Array: arrayData,
        }));
      }
    );
  };

  //   //load location 3
  const getLocation2 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName1 = res.data.dataList;
        let arrayData = [];
        if (state.getLocation2Array.length === 0) {
          for (var j = 0; j < nextLocationName1.length; j++) {
            arrayData.push(nextLocationName1[j]);
          }
        } else {
          arrayData = state.getLocation2Array;
          for (var i = 0; i < nextLocationName1.length; i++) {
            var unique = "Yes";
            for (var j = 0; j < arrayData.length; j++) {
              if (arrayData[j].id === nextLocationName1[i].id) {
                unique = "No";
              }
            }
            if (unique == "Yes") {
              arrayData.push(nextLocationName1[i]);
            }
          }
        }

        setState((prevState) => ({
          ...prevState,
          nextLocationName1: arrayData,
          getLocation2Array: arrayData,
        }));
      }
    );
  };

  //   //load location 4
  const getLocation3 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName2 = res.data.dataList;
        let arrayData = [];
        if (state.getLocation3Array.length === 0) {
          for (var j = 0; j < nextLocationName2.length; j++) {
            arrayData.push(nextLocationName2[j]);
          }
        } else {
          arrayData = state.getLocation3Array;
          for (var i = 0; i < nextLocationName2.length; i++) {
            var unique = "Yes";
            for (var j = 0; j < arrayData.length; j++) {
              if (arrayData[j].id === nextLocationName2[i].id) {
                unique = "No";
              }
            }
            if (unique == "Yes") {
              arrayData.push(nextLocationName2[i]);
            }
          }
        }
        setState((prevState) => ({
          ...prevState,
          nextLocationName2: arrayData,
          getLocation3Array: arrayData,
        }));
      }
    );
  };

  //   //load location 5
  const getLocation4 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName3 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName3: nextLocationName3,
        }));
      }
    );
  };

  //   //load location 6
  const getLocation5 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName4 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName4: nextLocationName4,
        }));
      }
    );
  };

  //   //load location 7
  const getLocation6 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName5 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName5: nextLocationName5,
        }));
      }
    );
  };

  //edit functionality
  useEffect(() => {
    if (inputId.length > 0) {
      let res = inputId || [];
      callLocationName(res);
    }
  }, [inputId]);

  //filter location data on edit
  const callLocationName = async (arr) => {
    if (arr[1]) {
      var result = await apigetUrl(
        `/auth/locations?parentId=${arr[0]}&page=1&limit=1000`
      );
      if (result) {
        let zone = [];
        let zoneName = [];
        for (var i = 0; i < arr[1].length; i++) {
          zone = (result.data.dataList || []).find((n) => n.id === arr[1][i]);
          if (zone) {
            zoneName.push(zone);
          }
        }
        setState((prevState) => ({
          ...prevState,
          locationName: result.data.dataList,
          locationData: zoneName || [],
        }));
      }
    }
    if (arr[1]) {
      let stateValue = [];
      let stateName = [];
      let statelocationdata = [];
      for (var i = 0; i < arr[1].length; i++) {
        var result = await apigetUrl(
          `/auth/locations?parentId=${arr[1][i]}&page=1&limit=1000`
        );
        if (result) {
          var resultdata = result.data.dataList;
          for (var z = 0; z < resultdata.length; z++) {
            statelocationdata.push(resultdata[z]);
          }
          for (var j = 0; j < arr[2].length; j++) {
            let stateValue = (result.data.dataList || []).find(
              (n) => n.id === arr[2][j]
            );
            if (stateValue) {
              stateName.push(stateValue);
            }
          }
        }
      }
      setState((prevState) => ({
        ...prevState,
        nextLocationName: statelocationdata,
        location1Data: stateName || [],
      }));
    }
    if (arr[2]) {
      let cluster = [];
      let clusterData = [];
      let clusterlocationdata = [];
      for (var i = 0; i < arr[2].length; i++) {
        var result = await apigetUrl(
          `/auth/locations?parentId=${arr[2][i]}&page=1&limit=1000`
        );
        if (result) {
          var resultdata = result.data.dataList;
          for (var z = 0; z < resultdata.length; z++) {
            clusterlocationdata.push(resultdata[z]);
          }
          for (var j = 0; j < arr[3].length; j++) {
            let cluster = (result.data.dataList || []).find(
              (n) => n.id === arr[3][j]
            );
            if (cluster) {
              clusterData.push(cluster);
            }
          }
        }
      }
      setState((prevState) => ({
        ...prevState,
        location2Data: clusterData || [],
        nextLocationName1: clusterlocationdata,
      }));
    }
    if (arr[3]) {
      let district = [];
      let districtData = [];
      let districtlocationdata = [];
      for (var i = 0; i < arr[3].length; i++) {
        var result = await apigetUrl(
          `/auth/locations?parentId=${arr[3][i]}&page=1&limit=1000`
        );
        if (result) {
          var resultdata = result.data.dataList;
          for (var z = 0; z < resultdata.length; z++) {
            districtlocationdata.push(resultdata[z]);
          }
          for (var j = 0; j < arr[4].length; j++) {
            let district = (result.data.dataList || []).find(
              (n) => n.id === arr[4][j]
            );
            if (district) {
              districtData.push(district);
            }
          }
        }
      }
      setState((prevState) => ({
        ...prevState,
        location3Data: districtData || [],
        nextLocationName2: districtlocationdata,
      }));
    }
    // if (arr[4]) {
    //   apigetUrl(`/auth/locations?parentId=${arr[4]}&page=1&limit=1000`).then(
    //     (res) => {
    //       console.log("city", res.data.dataList);
    //       let city = (res.data.dataList || []).find((n) => n.id === arr[5]);
    //       let cityName = (city || {}).name;
    //       console.log("cityName", cityName);
    //       setState((prevState) => ({
    //         ...prevState,
    //         location5: cityName || "",
    //         nextLocationName3: res.data.dataList,
    //       }));
    //     }
    //   );
    // }
    console.log(state);
  };

  //   //on change location hierachy filter
  const LocationHierarchyFilter = (e) => {
    // let value = e.target.value
    // if (value === 1) {
    //   setState((prevState) => ({
    //     ...prevState,
    //     locationHierarchyValue: value,
    //     locationHierarchyZone: true,
    //     locationHierarchyState: false,
    //     locationHierarchyCluster: false,
    //     locationHierarchyDistrict: false,
    //   }));
    // }
    // else if (value === 2) {
    //   setState((prevState) => ({
    //     ...prevState,
    //     locationHierarchyValue: value,
    //     locationHierarchyZone: true,
    //     locationHierarchyState: true,
    //     locationHierarchyCluster: false,
    //     locationHierarchyDistrict: false,
    //   }));
    // }
    // else if (value === 3) {
    //   setState((prevState) => ({
    //     ...prevState,
    //     locationHierarchyValue: value,
    //     locationHierarchyZone: true,
    //     locationHierarchyState: true,
    //     locationHierarchyCluster: true,
    //     locationHierarchyDistrict: false,
    //   }));
    // }
    // else if (value === 4) {
    //   setState((prevState) => ({
    //     ...prevState,
    //     locationHierarchyValue: value,
    //     locationHierarchyZone: true,
    //     locationHierarchyState: true,
    //     locationHierarchyCluster: true,
    //     locationHierarchyDistrict: true,
    //   }));
    // }
    // else {
    //   setState((prevState) => ({
    //     ...prevState,
    //     locationHierarchyValue: value,
    //     locationHierarchyZone: false,
    //     locationHierarchyState: false,
    //     locationHierarchyCluster: false,
    //     locationHierarchyDistrict: false,
    //   }));
    // }
  };

  const getSelectedItem = (productId) => {
    console.log("allData-id", state.allData);
    console.log("allData-id", productId);
    // const item = state.locationName.find((n) => n.id === productId);
    // if (item) {
    //   return item.name;
    // } else if (item === null) {
    //   return "";
    //}
  };

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <FormControl
            variant="outlined"
            className="mb-3"
            style={{ width: "23%", marginRight: "20px" }}
          >
            <InputLabel id="demo-simple-select-outlined-label">
              Location Hierarchy
            </InputLabel>
            <InputSelect
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={state.locationHierarchyValue}
              onChange={(e) => LocationHierarchyFilter(e)}
              label="Location Hierarchy"
            >
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              {state.levelDropDown &&
                state.levelDropDown.map((option) => (
                  <MenuItem
                    name="productTypeId"
                    key={option.id}
                    value={option.id}
                  >
                    {option.level}
                  </MenuItem>
                ))}
            </InputSelect>
          </FormControl>
        </div>
      </div>
      <div>
        {(state.data || []).length === 4
          ? state.data &&
            state.data
              .slice(0)
              .reverse()
              .map((n) => {
                if (n.fixed) {
                  return (
                    <FormControl
                      variant="outlined"
                      className="mb-3"
                      style={{ width: "23%", marginRight: "20px" }}
                      key={n.defaultId}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        {n.levelName}
                      </InputLabel>
                      <InputSelect
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={n.defaultName}
                        displayEmpty
                        // onChange={(e) => handleTrueChange(e, n.defaultId)}
                        label={n.levelName}
                      >
                        <MenuItem value={n.defaultName}>
                          {n.defaultName}
                        </MenuItem>
                      </InputSelect>
                    </FormControl>
                  );
                } else {
                  return (
                    <>
                      {n.levelName ===
                        state.falseData.slice(0).reverse()[0].levelName &&
                      state.locationHierarchyZone === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%", marginRight: "28px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={state.locationData}
                              //value={state.location1[0]}
                              onChange={(e, value, reason) =>
                                handleFalseChange(
                                  e,
                                  value,
                                  n.levelName,
                                  reason,
                                  "level1"
                                )
                              }
                              options={state.locationName}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                          state.falseData.slice(0).reverse()[1].levelName &&
                        state.locationHierarchyZone === true &&
                        state.locationHierarchyState === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%", marginRight: "28px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={state.location1Data}
                              onChange={(e, value, reason) =>
                                handleFalseChange(
                                  e,
                                  value,
                                  n.levelName,
                                  reason,
                                  "level2"
                                )
                              }
                              options={state.nextLocationName}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                          state.falseData.slice(0).reverse()[2].levelName &&
                        state.locationHierarchyZone === true &&
                        state.locationHierarchyState === true &&
                        state.locationHierarchyCluster === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%", marginRight: "28px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={state.location2Data}
                              onChange={(e, value, reason) =>
                                handleFalseChange(
                                  e,
                                  value,
                                  n.levelName,
                                  reason,
                                  "level3"
                                )
                              }
                              options={state.nextLocationName1}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                          state.falseData.slice(0).reverse()[3].levelName &&
                        state.locationHierarchyZone === true &&
                        state.locationHierarchyState === true &&
                        state.locationHierarchyCluster === true &&
                        state.locationHierarchyDistrict === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={state.location3Data}
                              onChange={(e, value, reason) =>
                                handleFalseChange(
                                  e,
                                  value,
                                  n.levelName,
                                  reason,
                                  "level4"
                                )
                              }
                              options={state.nextLocationName2}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : null}
                    </>
                  );
                }
              })
          : state.data &&
            state.data
              .slice(0)
              .reverse()
              .map((n) => {
                if (n.fixed) {
                  return (
                    <FormControl
                      variant="outlined"
                      className="mb-3 ml-2"
                      style={{ width: "15%", marginLeft: "0px" }}
                      key={n.defaultId}
                    >
                      <InputLabel id="demo-simple-select-outlined-label">
                        {n.levelName}
                      </InputLabel>
                      <InputSelect
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={n.defaultName}
                        displayEmpty
                        // onChange={(e) => handleTrueChange(e, n.defaultId)}
                        label={n.levelName}
                      >
                        <MenuItem value={n.defaultName}>
                          {n.defaultName}
                        </MenuItem>
                      </InputSelect>
                    </FormControl>
                  );
                } else {
                  return (
                    <>
                      {n.levelName ===
                        state.falseData.slice(0).reverse()[0].levelName &&
                      state.locationHierarchyZone === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              // value={getSelectedItem((option) =>option.name)}
                              value={state.location1}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.locationName}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                          state.falseData.slice(0).reverse()[1].levelName &&
                        state.locationHierarchyZone === true &&
                        state.locationHierarchyState === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={getSelectedItem((option) => option.name)}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.nextLocationName}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                          state.falseData.slice(0).reverse()[2].levelName &&
                        state.locationHierarchyZone === true &&
                        state.locationHierarchyState === true &&
                        state.locationHierarchyCluster === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={getSelectedItem((option) => option.name)}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.nextLocationName1}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                          state.falseData.slice(0).reverse()[3].levelName &&
                        state.locationHierarchyZone === true &&
                        state.locationHierarchyState === true &&
                        state.locationHierarchyCluster === true &&
                        state.locationHierarchyDistrict === true ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={getSelectedItem((option) => option.name)}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.nextLocationName2}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[4].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={getSelectedItem((option) => option.name)}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.nextLocationName3}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[5].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={getSelectedItem((option) => option.name)}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.nextLocationName4}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[6].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputMultiSelectAutocomplete
                              value={getSelectedItem((option) => option.name)}
                              onChange={(e, value) =>
                                handleFalseChange(e, value, n.levelName)
                              }
                              options={state.nextLocationName5}
                              getOptionLabel={(option) => option.name}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="outlined"
                                  placeholder={n.levelName}
                                />
                              )}
                            />
                          </FormControl>
                        </>
                      ) : null}
                    </>
                  );
                }
              })}
      </div>
    </>
  );
};

export default LocationHierarchy;
