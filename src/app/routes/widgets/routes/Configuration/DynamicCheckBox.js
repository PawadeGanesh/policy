import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import localforage from "localforage";
import _ from "lodash";
import { apigetUrl } from "setup/middleware";

const returnBoolean = (value) => {
  switch (value) {
    case 1:
      return true;
    case 0:
      return false;
  }
};

const DynamicCheckBox = forwardRef((props, ref) => {
  const {
    id,
    description,
    isEditable,
    key,
    name,
    value,
    isVisible,
    dataListTypeId,
    rowVersion,
  } = props;

  const [state, setState] = useState({
    checkBox: {},
    id,
    rowVersion,
    typeOfComponent: "dynamicCheckBox",
    handleChangeInitiated: false,
  });

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  useEffect(() => {
    const { checkBox } = state;

    if (!isObjEmpty(checkBox)) {
      let tempPopulatedCheckBoxArray = [];

      if (state.handleChangeInitiated && !ref.current.responseStatus) {
        for (var key of Object.keys(checkBox)) {
          tempPopulatedCheckBoxArray.push(
            <FormControlLabel
              control={
                <Checkbox
                  key={key}
                  aria-label="Checkbox"
                  checked={checkBox[key]["checked"]}
                  onChange={handleCheckBoxChange}
                  name={checkBox[key]["name"]}
                  id={key}
                  disabled={!returnBoolean(isEditable)}
                />
              }
              label={checkBox[key]["name"]}
            />
          );
        }
      } else if (!state.handleChangeInitiated && ref.current.responseStatus) {
        for (var key of Object.keys(checkBox)) {
          tempPopulatedCheckBoxArray.push(
            <FormControlLabel
              control={
                <Checkbox
                  key={key}
                  aria-label="Checkbox"
                  checked={checkBox[key]["checked"]}
                  onChange={handleCheckBoxChange}
                  name={checkBox[key]["name"]}
                  id={key}
                  disabled={!returnBoolean(isEditable)}
                />
              }
              label={checkBox[key]["name"]}
            />
          );
        }
      } else if (state.handleChangeInitiated && ref.current.responseStatus) {
        for (var key of Object.keys(checkBox)) {
          tempPopulatedCheckBoxArray.push(
            <FormControlLabel
              control={
                <Checkbox
                  key={key}
                  aria-label="Checkbox"
                  checked={checkBox[key]["checked"]}
                  onChange={handleCheckBoxChange}
                  name={checkBox[key]["name"]}
                  id={key}
                  disabled={!returnBoolean(isEditable)}
                />
              }
              label={checkBox[key]["name"]}
            />
          );
        }
      } else {
        for (var key of Object.keys(checkBox)) {
          if (
            parseInt(key) ===
            apiCheckBoxValues[apiCheckBoxValues.indexOf(parseInt(key))]
          ) {
            tempPopulatedCheckBoxArray.push(
              <FormControlLabel
                control={
                  <Checkbox
                    key={key}
                    aria-label="Checkbox"
                    checked={checkBox[key]["checked"]}
                    onChange={handleCheckBoxChange}
                    name={checkBox[key]["name"]}
                    id={key}
                    disabled={!returnBoolean(isEditable)}
                  />
                }
                label={checkBox[key]["name"]}
              />
            );
          } else {
            tempPopulatedCheckBoxArray.push(
              <FormControlLabel
                control={
                  <Checkbox
                    key={key}
                    aria-label="Checkbox"
                    checked={false}
                    onChange={handleCheckBoxChange}
                    name={checkBox[key]["name"]}
                    id={key}
                    disabled={!returnBoolean(isEditable)}
                  />
                }
                label={checkBox[key]["name"]}
              />
            );
          }
        }
      }

      setPopulatedCheckBoxArray(tempPopulatedCheckBoxArray);
    } else {
      return;
    }
  }, [state]);

  useEffect(() => {
    let checkBoxValueToBeChecked = [];
    for (var key of Object.keys(state.checkBox)) {
      if (state.checkBox[key]["checked"]) {
        checkBoxValueToBeChecked.push(state.checkBox[key]["id"]);
      }
    }

    const joinedValues = checkBoxValueToBeChecked.join();

    if (joinedValues === "") {
      return;
    } else if (joinedValues !== value) {
      localforage
        .setItem("dynamicCheckBox", state)
        .then(function() {
          return localforage.getItem("dynamicCheckBox");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicCheckBox", function(err, value) {
        localforage.getItem("dynamicCheckBox", function(err, value) {});
      });
    }
  }, [state]);

  const [populatedCheckBoxArray, setPopulatedCheckBoxArray] = useState([]);

  const convertCheckBoxApiDataToBoolean = (dataList) => {
    let extractedCheckBoxApiData = {};
    dataList.map(({ name, id }) => {
      const tempObj = {};
      tempObj.name = name;
      tempObj.id = id.toString();
      tempObj.checked = true;
      extractedCheckBoxApiData[id] = tempObj;
    });

    setState((prevState) => ({
      ...prevState,
      checkBox: extractedCheckBoxApiData,
    }));
  };

  const getDataListIdApiData = (dataListTypeId) => {
    if (dataListTypeId) {
      apigetUrl(`/config/core-data?page=1&limit=100&typeId=${dataListTypeId}`)
        .then((response) => {
          convertCheckBoxApiDataToBoolean(response.data.dataList);
        })
        .catch((error) => {});
    }
  };

  const [apiCheckBoxValues, setApiCheckBoxValues] = useState([]);

  useEffect(() => {
    getDataListIdApiData(dataListTypeId);
  }, [apiCheckBoxValues]);

  useEffect(() => {
    const tempValueToNumber = value.split(",").map((item) => {
      return parseInt(item);
    });

    setApiCheckBoxValues(tempValueToNumber);
  }, [props]);

  const handleCheckBoxChange = (event) => {
    const { checkBox } = state;

    var deepCheckBox = _.cloneDeep(checkBox);

    deepCheckBox[event.target.id] = {
      name: event.target.name,
      id: event.target.id,
      checked: event.target.checked,
    };

    setState((prevState) => ({
      ...prevState,
      checkBox: deepCheckBox,
      handleChangeInitiated: true,
    }));
  };

  return isVisible ? (
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
            <FormGroup>{populatedCheckBoxArray}</FormGroup>
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
    <></>
  );
});

export default React.memo(DynamicCheckBox);
