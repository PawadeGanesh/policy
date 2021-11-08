import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import apiInstance from "setup";
import { apigetUrl } from "setup/middleware";
import InputSelect from "app/routes/widgets/routes/CommonComponents/Select";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

// const api = axios.create({
//   baseURL: baseURL,
// });

const DashboardFilters = ({ handler, inputId }) => {
  console.log("inputId", inputId);
  const { authUser } = useSelector(({ auth }) => auth);
  const [state, setState] = useState({
    data: [],
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
  });

  useEffect(() => {
    let data = authUser && authUser.locationFilters;
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
      data: data,
      levelName: levelName,
      falseData: falseData,
      trueData: trueData,
      lastValue: lastValue,
    }));
  }, []);

  const getLocation = (id) => {
    console.log("getLocation", id);
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let locationName = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          locationName: locationName,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  // const handleTrueChange = (e, id) => {
  //   handler(id);
  // };

  const handleFalseChange = (e, levelName) => {
    console.log("lvlName", e.target.value);
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

        handler(setId, "zone");
        getLocation1(setId);
        setState((prevState) => ({
          ...prevState,
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
        handler(setId, "state");
        getLocation2(setId);
        setState((prevState) => ({
          ...prevState,

          nextLocationName1: [],
          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
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
        handler(setId, "cluster");
        getLocation3(setId);
        setState((prevState) => ({
          ...prevState,

          nextLocationName2: [],
          nextLocationName3: [],
          nextLocationName4: [],
          nextLocationName5: [],
        }));
      } else {
        setState((prevState) => ({
          ...prevState,
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
        handler(setId, "district");
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
        handler(setId, "city");
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
        handler(setId, "area");
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
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let nextLocationName = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName: nextLocationName,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getLocation2 = (id) => {
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let nextLocationName1 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName1: nextLocationName1,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getLocation3 = (id) => {
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let nextLocationName2 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName2: nextLocationName2,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getLocation4 = (id) => {
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let nextLocationName3 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName3: nextLocationName3,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getLocation5 = (id) => {
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let nextLocationName4 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName4: nextLocationName4,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  const getLocation6 = (id) => {
    axios
      .get(
        `${baseURL}/auth/locations?parentId=${id}&page=1&limit=1000`,
        apiInstance
      )
      .then((res) => {
        let nextLocationName5 = res.data.dataList;
        setState((prevState) => ({
          ...prevState,
          nextLocationName5: nextLocationName5,
        }));
      })
      .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    let arr = inputId;
    console.log("inputId", inputId);
    if (arr) {
      if (arr[0]) {
        axios
          .get(
            `${baseURL}/auth/locations?parentId=${arr[0]}&page=1&limit=1000`,
            apiInstance
          )
          .then((res) => {
            console.log("zoneName", res.data.dataList);
            let zone = (res.data.dataList || []).find((n) => n.id === arr[1]);
            let zoneName = (zone || {}).name;
            console.log("zoneName", zoneName);
            setState((prevState) => ({
              ...prevState,
              location1: zoneName || "",
              locationName: res.data.dataList,
            }));
          });
      }
      if (arr[1]) {
        axios
          .get(
            `${baseURL}/auth/locations?parentId=${arr[1]}&page=1&limit=1000`,
            apiInstance
          )
          .then((res) => {
            console.log("zoneName", res.data.dataList);
            let state = (res.data.dataList || []).find((n) => n.id === arr[2]);
            let stateName = (state || {}).name;
            console.log("stateName", stateName);
            setState((prevState) => ({
              ...prevState,
              location2: stateName || "",
              nextLocationName: res.data.dataList,
            }));
          });
      }

      if (arr[2]) {
        axios
          .get(
            `${baseURL}/auth/locations?parentId=${arr[2]}&page=1&limit=1000`,
            apiInstance
          )
          .then((res) => {
            console.log("cluster", res.data.dataList);
            let cluster = (res.data.dataList || []).find(
              (n) => n.id === arr[3]
            );
            let clusterName = (cluster || {}).name;
            console.log("clusterName", clusterName);
            setState((prevState) => ({
              ...prevState,
              location3: clusterName || "",
              nextLocationName1: res.data.dataList,
            }));
          });
      }
      if (arr[3]) {
        axios
          .get(
            `${baseURL}/auth/locations?parentId=${arr[3]}&page=1&limit=1000`,
            apiInstance
          )
          .then((res) => {
            console.log("district", res.data.dataList);
            let district = (res.data.dataList || []).find(
              (n) => n.id === arr[4]
            );
            let districtName = (district || {}).name;
            console.log("districtName", districtName);
            setState((prevState) => ({
              ...prevState,
              location4: districtName || "",
              nextLocationName2: res.data.dataList,
            }));
          });
      }

      if (arr[4]) {
        axios
          .get(
            `${baseURL}/auth/locations?parentId=${arr[4]}&page=1&limit=1000`,
            apiInstance
          )
          .then((res) => {
            console.log("city", res.data.dataList);
            let city = (res.data.dataList || []).find((n) => n.id === arr[5]);
            let cityName = (city || {}).name;
            console.log("cityName", cityName);
            setState((prevState) => ({
              ...prevState,
              location5: cityName || "",
              nextLocationName3: res.data.dataList,
            }));
          });
      }
    }
  }, [inputId]);

  return (
    <>
      {console.log("state-data", state.falseData)}
      <div>
        {state.data &&
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
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      value={n.defaultName}
                      displayEmpty
                      // onChange={(e) => handleTrueChange(e, n.defaultId)}
                      label={n.levelName}
                    >
                      <MenuItem value={n.defaultName}>{n.defaultName}</MenuItem>
                      {/* <MenuItem value={n.defaultName}>{n.defaultName}</MenuItem> */}
                    </Select>
                  </FormControl>
                );
              } else {
                console.log("n", state.location1);
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

                          <Select
                            native
                            value={state.location1}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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
                          <Select
                            native
                            value={state.location2}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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
                          <Select
                            native
                            value={state.location3}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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
                          <Select
                            native
                            value={state.location4}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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
                          <Select
                            native
                            value={state.location5}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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
                          <Select
                            native
                            value={state.location6}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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
                          <Select
                            native
                            value={state.location7}
                            onChange={(e) => handleFalseChange(e, n.levelName)}
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
                          </Select>
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

export default DashboardFilters;
