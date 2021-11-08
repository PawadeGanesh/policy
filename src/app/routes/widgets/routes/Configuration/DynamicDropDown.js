import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import localforage from "localforage";
import { apigetUrl } from "setup/middleware";

const returnBoolean = (value) => {
  switch (value) {
    case 1:
      return true;
    case 0:
      return false;
  }
};

const DynamicDropDown = forwardRef((props, ref) => {
  const [dropDownValue, setDropDownValue] = useState("");
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

  const [dropDownDataList_ApiData, setDropDownDataList_ApiData] = useState([]);

  useEffect(() => {
    const extractedDropdownApiData = {};
    dropDownDataList_ApiData.map(({ name, id }) => {
      const tempObj = {};
      tempObj.name = name;
      tempObj.id = id.toString();

      extractedDropdownApiData[id] = tempObj;

      console.log("typeof id = ", typeof id);
    });

    setState((prevState) => ({
      ...prevState,
      dropDown: extractedDropdownApiData,
      id,
      rowVersion,
      typeOfComponent: "dynamicDropDown",
    }));
  }, [dropDownDataList_ApiData]);

  const getDataListIdApiData = (dataListTypeId) => {
    if (dataListTypeId) {
      apigetUrl(`/config/core-data?page=1&limit=100&typeId=${dataListTypeId}`)
        .then((response) => {
          setDropDownDataList_ApiData(response.data.dataList);
        })
        .catch((error) => {});
    }
  };

  useEffect(() => {
    setDropDownValue(value);
    getDataListIdApiData(dataListTypeId);
    setState((prevState) => ({
      ...prevState,
      dropDown: { [value]: { id: " " } },
      id,
      rowVersion,
    }));
  }, [props]);

  const handleDropDownChange = (event) => {
    event.stopPropagation();

    const { dropDown } = state;

    dropDown[event.target.value] = {
      name: dropDown[event.target.value]["name"],
      id: event.target.value,
    };

    setDropDownValue(event.target.value);

    setState((prevState) => ({
      ...prevState,
      dropDown: dropDown,
      id,
      rowVersion,
    }));
  };

  const [state, setState] = useState({
    dropDown: { [value]: { id: "" } },
    id,
    rowVersion,
    typeOfComponent: "dynamicPassword",
  });

  const [
    renderPopulatedDropdownData,
    setRenderPopulatedDropdownData,
  ] = useState([]);

  const populateDropdownMenuItems = () => {
    const tempDropDownPopulatedList = [];

    const { dropDown } = state;
    for (var key of Object.keys(dropDown)) {
      tempDropDownPopulatedList.push(
        <MenuItem key={key} value={dropDown[key]["id"]}>
          {dropDown[key]["name"]}
        </MenuItem>
      );
    }

    setRenderPopulatedDropdownData(tempDropDownPopulatedList);
  };

  function isObjEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }

  useEffect(() => {
    if (dropDownValue === "") {
      return;
    } else if (dropDownValue !== value) {
      localforage
        .setItem("dynamicDropDown", {
          dropDownValue,
          id,
          rowVersion,
          typeOfComponent: "dynamicDropDown",
        })
        .then(function() {
          return localforage.getItem("dynamicDropDown");
        })
        .then(function(value) {})
        .catch(function(err) {});
    } else {
      localforage.removeItem("dynamicDropDown", function(err, value) {
        localforage.getItem("dynamicDropDown", function(err, value) {});
      });
    }
  }, [dropDownValue]);

  useEffect(() => {
    if (!isObjEmpty(state.dropDown)) {
      populateDropdownMenuItems();
    } else {
      return;
    }
  }, [state]);

  function RenderTextField() {
    return (
      <div className="w-100">
        <div class="row">
          <div class="col-xl-5 col-sm-12">
            <Typography>
              {name} <br></br>
              <Typography variant="caption">{description}</Typography>
            </Typography>
          </div>
          <div class="col-xl-7 col-sm-12">
            <FormControl variant="outlined" className="w-75">
              <Select
                disabled={!returnBoolean(isEditable)}
                labelId="demo-simple-select-outlined-label"
                id={id}
                value={dropDownValue}
                onChange={handleDropDownChange}
                label={description}
                name={name}
              >
                {renderPopulatedDropdownData}
              </Select>
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
    );
  }

  return isVisible ? <>{<RenderTextField />}</> : <></>;
});

DynamicDropDown.propTypes = {};

export default DynamicDropDown;
