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

const LocationFilter = ({
  handler,
  inputId,
  isActive,
  handlingDefaultValue,
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
  });

  useEffect(() => {
    let data = authUser && authUser.locationFilters;
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
      // levelName: levelName,
      falseData: falseData,
      trueData: trueData,
      lastValue: lastValue,
    }));
  }, []);

  useEffect(() => {
    if (state.userId === "admin") {
      if (isActive) {
        setState((prevState) => ({
          ...prevState,
          location1: "All Zones",
          locationName: [],
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
        getLocation(inputId[0]);
      }
    }
    if (state.userId === "zonehead") {
      if (isActive) {
        setState((prevState) => ({
          ...prevState,
          location1: "All Zones",
          locationName: [],
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
        getLocation(inputId[1]);
      }
    }
    if (state.userId === "statehead") {
      if (isActive) {
        setState((prevState) => ({
          ...prevState,
          location1: "All Zones",
          locationName: [],
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
        getLocation(inputId[2]);
      }
    }
    if (state.userId === "clusterhead") {
      if (isActive) {
        setState((prevState) => ({
          ...prevState,
          location1: "All Zones",
          locationName: [],
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
        getLocation(inputId[3]);
      }
    }
    if (state.userId === "districthead") {
      if (isActive) {
        setState((prevState) => ({
          ...prevState,
          location1: "All Zones",
          locationName: [],
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
        getLocation(inputId[4]);
      }
    }
  }, [inputId, state.userId, isActive]);

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

  // const handleTrueChange = (e, id) => {
  //   handler(id);
  // };

  const handleFalseChange = (e, levelName) => {
    if (e.target.value === levelName) {
      handlingDefaultValue(e);
    }

    if (levelName === state.falseData.slice(0).reverse()[0].levelName) {
      let location1 = e.target.value;
      setState((prevState) => ({
        ...prevState,
        location1: location1,
      }));

      const searchId = state.locationName.find(
        (n) => n.name === e.target.value
      );
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
        // handler(1);
        setState((prevState) => ({
          ...prevState,
          // falseData: [],
          location2: "All States",
          nextLocationName: [],
          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      }
    } else if (levelName === state.falseData.slice(0).reverse()[1].levelName) {
      let location2 = e.target.value;
      setState((prevState) => ({
        ...prevState,
        location2: location2 || null,
      }));

      const searchId = state.nextLocationName.find(
        (n) => n.name === e.target.value
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
    } else if (levelName === state.falseData.slice(0).reverse()[2].levelName) {
      let location3 = e.target.value;
      setState((prevState) => ({
        ...prevState,
        location3: location3 || null,
      }));
      const searchId = state.nextLocationName1.find(
        (n) => n.name === e.target.value
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
    } else if (levelName === state.falseData.slice(0).reverse()[3].levelName) {
      let location4 = e.target.value;
      setState((prevState) => ({
        ...prevState,
        location4: location4 || "",
      }));

      const searchId = state.nextLocationName2.find(
        (n) => n.name === e.target.value
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
    } else if (levelName === state.falseData.slice(0).reverse()[4].levelName) {
      let location5 = e.target.value;
      setState((prevState) => ({
        ...prevState,
        location5: location5 || "",
      }));

      const searchId = state.nextLocationName3.find(
        (n) => n.name === e.target.value
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
    } else if (levelName === state.falseData.slice(0).reverse()[5].levelName) {
      let location6 = e.target.value;
      setState((prevState) => ({
        ...prevState,
        location6: location6 || "",
      }));

      const searchId = state.nextLocationName4.find(
        (n) => n.name === e.target.value
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
  };

  const getLocation1 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName: nextLocationName,
        }));
      }
    );
  };

  const getLocation2 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName1 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName1: nextLocationName1,
        }));
      }
    );
  };

  const getLocation3 = (id) => {
    apigetUrl(`/auth/locations?parentId=${id}&page=1&limit=1000`).then(
      (res) => {
        let nextLocationName2 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName2: nextLocationName2,
        }));
      }
    );
  };

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

  useEffect(() => {
    const { userId } = state;

    if (userId === "admin") {
      let res = inputId || [];
      callLocationName(res);
    }
    if (userId === "zonehead") {
      let res = inputId;
      let arr = (res || []).slice(1);
      callLocationName(arr);
    }
    if (userId === "statehead") {
      let res = inputId;
      let arr = (res || []).slice(2);
      callLocationName(arr);
    }
    if (userId === "clusterhead") {
      let res = inputId;
      let arr = (res || []).slice(3);
      callLocationName(arr);
    }
    if (userId === "districthead") {
      let res = inputId;
      let arr = (res || []).slice(4);
      callLocationName(arr);
    }
  }, [inputId, state.userId]);

  const callLocationName = (arr) => {
    if (arr[1]) {
      apigetUrl(`/auth/locations?parentId=${arr[0]}&page=1&limit=1000`).then(
        (res) => {
          let zone = (res.data.dataList || []).find((n) => n.id === arr[1]);
          let zoneName = (zone || {}).name;
          setState((prevState) => ({
            ...prevState,
            location1: zoneName || "",
            locationName: res.data.dataList || [],
          }));
        }
      );
    }
    if (arr[1]) {
      apigetUrl(`/auth/locations?parentId=${arr[1]}&page=1&limit=1000`).then(
        (res) => {
          let state = (res.data.dataList || []).find((n) => n.id === arr[2]);
          let stateName = (state || {}).name;
          setState((prevState) => ({
            ...prevState,
            location2: stateName || "",
            nextLocationName: res.data.dataList,
          }));
        }
      );
    }
    if (arr[2]) {
      apigetUrl(`/auth/locations?parentId=${arr[2]}&page=1&limit=1000`).then(
        (res) => {
          let cluster = (res.data.dataList || []).find((n) => n.id === arr[3]);
          let clusterName = (cluster || {}).name;
          setState((prevState) => ({
            ...prevState,
            location3: clusterName || "",
            nextLocationName1: res.data.dataList,
          }));
        }
      );
    }
    if (arr[3]) {
      apigetUrl(`/auth/locations?parentId=${arr[3]}&page=1&limit=1000`).then(
        (res) => {
          let district = (res.data.dataList || []).find((n) => n.id === arr[4]);
          let districtName = (district || {}).name;
          setState((prevState) => ({
            ...prevState,
            location4: districtName || "",
            nextLocationName2: res.data.dataList,
          }));
        }
      );
    }
    if (arr[4]) {
      apigetUrl(`/auth/locations?parentId=${arr[4]}&page=1&limit=1000`).then(
        (res) => {
          let city = (res.data.dataList || []).find((n) => n.id === arr[5]);
          let cityName = (city || {}).name;
          setState((prevState) => ({
            ...prevState,
            location5: cityName || "",
            nextLocationName3: res.data.dataList,
          }));
        }
      );
    }
  };

  return (
    <>
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
                      state.falseData.slice(0).reverse()[0].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%", marginRight: "28px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>

                            <InputSelect
                              native
                              value={state.location1}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.locationName &&
                                state.locationName.map((n, i) => {
                                  return (
                                    <>
                                      <option key={i} value={n.name}>
                                        {n.name}
                                      </option>
                                    </>
                                  );
                                })}
                            </InputSelect>
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[1].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%", marginRight: "28px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location2}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName &&
                                state.nextLocationName.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[2].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%", marginRight: "28px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location3}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName1 &&
                                state.nextLocationName1.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[3].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 "
                            style={{ width: "23%" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location4}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName2 &&
                                state.nextLocationName2.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
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
                      state.falseData.slice(0).reverse()[0].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>

                            <InputSelect
                              native
                              value={state.location1}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.locationName &&
                                state.locationName.map((n, i) => {
                                  return (
                                    <>
                                      <option key={i} value={n.name}>
                                        {n.name}
                                      </option>
                                    </>
                                  );
                                })}
                            </InputSelect>
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[1].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location2}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.name}>All {n.levelName}s</option>
                              {state.nextLocationName &&
                                state.nextLocationName.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[2].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location3}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName1 &&
                                state.nextLocationName1.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
                          </FormControl>
                        </>
                      ) : n.levelName ===
                        state.falseData.slice(0).reverse()[3].levelName ? (
                        <>
                          <FormControl
                            variant="outlined"
                            className="mb-3 ml-2"
                            style={{ width: "15%", marginLeft: "0px" }}
                          >
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location4}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName2 &&
                                state.nextLocationName2.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
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
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location5}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName3 &&
                                state.nextLocationName3.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
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
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location6}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName4 &&
                                state.nextLocationName4.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
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
                            <InputLabel id="demo-simple-select-outlined-label">
                              {n.levelName}
                            </InputLabel>
                            <InputSelect
                              native
                              value={state.location7}
                              onChange={(e) =>
                                handleFalseChange(e, n.levelName)
                              }
                              label={n.levelName}
                              inputProps={{
                                name: "simple",
                                id: "demo-simple-select-outlined-label",
                              }}
                            >
                              <option value={n.levelName}>
                                All {n.levelName}s
                              </option>
                              {state.nextLocationName5 &&
                                state.nextLocationName5.map((n, i) => {
                                  return (
                                    <option key={i} value={n.name}>
                                      {n.name}
                                    </option>
                                  );
                                })}
                            </InputSelect>
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

export default LocationFilter;
