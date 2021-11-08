import React, { useState, useEffect } from "react";
import axios from "axios";
import CardBox from "./../../../../../components/CardBox/index";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const AdvancedSearch = (props) => {
  console.log("props = ", props.propData);
  const baseURL = `${process.env.REACT_APP_BASE_URL}`;
  const api = axios.create({
    baseURL: baseURL,
  });
  const [state, setState] = useState({
    name: "",
    event: "",
    archiveIn: "",
    purgeIn: "",
    createdBy: "",
    isEnabled: "",
    pageNumber: 1,
    limit: 10,
  });

  const setAdvancedSearchData = (data) => {
    setState((prevState) => ({ ...prevState, data: data }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const search = async (searchURL) => {
    api
      .get(searchURL)
      .then((res) => {
        setAdvancedSearchData(res.data.dataList);
        //showApiData(res.data.dataList);
      })
      .catch((error) => {
        console.log("Advanced Search Error");
      });
  };

  const isEmpty = (str) => {
    return !str || 0 === str.length;
  };

  const onSearchClick = (e) => {
    e.preventDefault();
    const {
      name,
      archiveIn,
      purgeIn,
      isEnabled,
      createdBy,
      createdDate,
      modifiedName,
      modifiedDate,
    } = state;

    console.log(
      `"name = "${name},"archiveIn = " ${archiveIn},"purgeIn ="${purgeIn},"isEnabled = "${isEnabled}, "createdBy = ${createdBy}"createdDate = ,${createdDate},"modifiedName = "${modifiedName},"modifiedDate = "${modifiedDate}`
    );

    let tempArr = [];
    if (!isEmpty(name)) tempArr.push({ name: name });
    if (!isEmpty(archiveIn)) tempArr.push({ archiveIn: archiveIn });

    if (!isEmpty(purgeIn)) tempArr.push({ purgeIn: purgeIn });
    if (!isEmpty(isEnabled)) tempArr.push({ isEnabled: isEnabled });

    if (!isEmpty(createdBy)) tempArr.push({ createdBy: createdBy });
    if (!isEmpty(createdDate)) tempArr.push({ createdDate: createdDate });

    if (!isEmpty(modifiedName)) tempArr.push({ modifiedName: modifiedName });
    if (!isEmpty(modifiedDate)) tempArr.push({ modifiedDate: modifiedDate });

    //console.log("tempArr = ", tempArr);

    let tempURL =
      baseURL +
      "/audit/events?" +
      "page=" +
      state.pageNumber +
      "&" +
      "limit=" +
      state.limit;

    let url = new URL(tempURL);

    let params = new URLSearchParams(url.search);

    tempArr.map((p) => {
      for (var key in p) {
        if (p.hasOwnProperty(key)) {
          console.log(key + " -> " + p[key]);
          params.append(key, p[key]);
        }
      }
    });
    // params.append("archiveIn", "182");

    // console.log("to string = ", params.toString());
    url.search = params.toString();

    console.log("url = ", url);

    search(url.href);
  };

  const setResetData = (data) => {
    setState((prevState) => ({ ...prevState, data: data }));
  };

  const callResetData = async () => {
    const res = await axios.get(
      baseURL + "/audit/events?page=1&limit=10&sortBy=name&sortType=asc"
    );
    console.log("res = ", res.data.dataList);
    setState((prevState) => ({
      ...prevState,
      name: "",
      isEnabled: "",
    }));
    setResetData(res.data.dataList);
  };

  const handleResetClick = (e) => {
    //setIsAdvancedSearch(!isAdvancedSearch);

    callResetData();
  };

  const createDynamicComponent = () => {
    const dynamicArray = [];

    // for (var key in props.propData[0]) {
    //   if (props.propData[0].hasOwnProperty(key)) {

    //   }
    // }
    console.log("props.propData.length = ", props.propData);
    Object.keys(props.propData[0]).forEach(function(key) {
      console.log(key, props.propData[0][key]);
      switch (key) {
        case "TextField":
          dynamicArray.push(
            React.createElement(TextField, {
              id: "name",
              label: "Name",
              variant: "outlined",
              onChange: (event) => handleChange(event),
              value: state.name,
              name: "name",
              fullWidth: true,
            })
          );
        case "Select":
          dynamicArray.push(
            // React.createElement(Select, {
            //   id: "isEnabled",
            //   label: "Is Enabled",
            //   variant: "outlined",
            //   onChange: (event) => handleChange(event),
            //   value: state.isEnabled,
            //   name: "isEnabled",
            //   fullWidth: true,
            // })
            <Select>
              <MenuItem value="">
                <em>Select</em>
              </MenuItem>
              <MenuItem value={1}>Enabled</MenuItem>
              <MenuItem value={0}>Not enabled</MenuItem>
            </Select>
          );
      }
    });

    //Object.entries(props.propData[0]).forEach(([key, value]) => {});
    console.log(dynamicArray);
    return dynamicArray;
  };

  return (
    <div className="row">
      <CardBox styleName="col-12" heading="Advanced Search">
        <form className="row" autoComplete="off">
          {/* <div className="col-lg-3 col-sm-6 col-12 mb-3">
            {React.createElement(TextField, {
              id: "name",
              label: "Name",
              variant: "outlined",
              onChange: (event) => handleChange(event),
              value: state.name,
              name: "name",
              fullWidth: true,
            })}
          </div>
          <div className="col-lg-3 col-sm-6 col-12 ml-n1">
            <FormControl variant="outlined" className="w-100 mb-2">
              <InputLabel id="isEnabled">Select</InputLabel>
              <Select
                labelId="isEnabled"
                id="isEnabled"
                value={state.isEnabled}
                onChange={(event) => handleChange(event)}
                label="Is Enabled"
                name="isEnabled"
              >
                <MenuItem value="">
                  <em>Select</em>
                </MenuItem>
                <MenuItem value={1}>Enabled</MenuItem>
                <MenuItem value={0}>Not enabled</MenuItem>
              </Select>
            </FormControl>
          </div> */}
          {createDynamicComponent()}
          <div className="pt-2 ml-2">
            <Button
              onClick={(event) => onSearchClick(event)}
              variant="contained"
              color="primary"
              className="mx-2"
            >
              Search
            </Button>
          </div>
          <div className="pt-2">
            <Button
              variant="contained"
              color="secondary"
              className="mx-2"
              onClick={(event) => handleResetClick(event)}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardBox>
    </div>
  );
};

export default AdvancedSearch;
