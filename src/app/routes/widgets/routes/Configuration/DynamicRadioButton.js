import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import axios from "axios";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import localforage from "localforage";
import apiInstance from "../../../../../setup/index";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const DynamicRadioButton = forwardRef((props, ref) => {
  const {
    id,
    description,
    key,
    name,
    value,
    isVisible,
    dataListTypeId,
    rowVersion,
  } = props;

  const [radioButtonValue, setRadioButtonValue] = React.useState("");

  useEffect(() => {
    getDataListIdApiData(dataListTypeId);

    setRadioButtonValue(value);
  }, [props]);

  const [state, setState] = useState({
    radioButton: {},
    id,
    rowVersion,
    typeOfComponent: "dynamicRadioButton",
  });

  const [
    radioButtonDataList_ApiData,
    setRadioButtonDataList_ApiData,
  ] = useState([]);

  useEffect(() => {
    const tempRadioButton = {};

    const tempObjArr = radioButtonDataList_ApiData.map(({ name, id }) => {
      const tempObj = {};
      tempObj.name = name;
      tempObj.id = id.toString();
      tempRadioButton[id] = tempObj;
    });

    setState((prevState) => ({
      ...prevState,
      radioButton: tempRadioButton,
    }));
  }, [radioButtonDataList_ApiData]);

  const handleRadioButtonChange = (event) => {
    setRadioButtonValue(event.target.value);

    event.stopPropagation();
  };

  const getDataListIdApiData = (dataListTypeId) => {
    if (dataListTypeId) {
      axios
        .get(
          baseURL +
            "/config/core-data?page=1&limit=100&typeId=" +
            dataListTypeId,
          apiInstance
        )
        .then((response) => {
          setRadioButtonDataList_ApiData(response.data.dataList);
        })
        .catch((error) => {});
    }
  };

  const [populatedRadioButtonArray, setPopulatedRadioButtonArray] = useState(
    []
  );

  useEffect(() => {
    let tempPopulatedRadioButtonArray = [];

    const { radioButton } = state;

    for (var key of Object.keys(radioButton)) {
      tempPopulatedRadioButtonArray.push(
        <FormControlLabel
          value={radioButton[key]["id"]}
          control={<Radio />}
          label={radioButton[key]["name"]}
        />
      );
    }

    setPopulatedRadioButtonArray(tempPopulatedRadioButtonArray);
  }, [state]);

  useEffect(() => {
    if (radioButtonValue === "") {
      return;
    } else if (radioButtonValue !== value) {
      localforage
        .setItem("dynamicRadioButton", {
          radioButtonValue,
          id,
          rowVersion,
          typeOfComponent: "dynamicRadioButton",
        })
        .then(function() {
          return localforage.getItem("dynamicRadioButton");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicRadioButton", function(err, value) {
        localforage.getItem("dynamicRadioButton", function(err, value) {});
      });
    }
  }, [radioButtonValue]);

  return (
    <>
      {isVisible ? (
        <div className="w-100">
          <div class="row">
            <div class="col-xl-5 col-sm-12">
              <Typography>
                {name}
                <br></br>
                <Typography variant="caption">{description}</Typography>
              </Typography>
            </div>
            <div class="col-xl-7 col-sm-12">
              <FormControl component="fieldset">
                <RadioGroup
                  name={name}
                  value={radioButtonValue}
                  onChange={handleRadioButtonChange}
                >
                  {populatedRadioButtonArray}
                </RadioGroup>
              </FormControl>
              {ref.current.responseStatus === "success" ? (
                <FormHelperText
                  style={{ color: "green" }}
                >{`${ref.current.responseStatus} - ${ref.current.responseMessage}`}</FormHelperText>
              ) : null}
              {ref.current.responseStatus === "failure" ? (
                <FormHelperText
                  style={{ color: "red" }}
                >{`${ref.current.responseStatus} - ${ref.current.responseMessage}`}</FormHelperText>
              ) : null}
              {ref.current.responseStatus === undefined ? (
                <FormHelperText style={{ color: "red" }}></FormHelperText>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <form></form>
      )}
    </>
  );
});

DynamicRadioButton.propTypes = {};

export default DynamicRadioButton;
