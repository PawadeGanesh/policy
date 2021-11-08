import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";

const HOC = (WrappedComponent) => {
  const NewComponent = ({ setResetData, setAdvancedSearchData }) => {
    const baseURL = `${process.env.REACT_APP_BASE_URL}`;

    const api = axios.create({
      baseURL: baseURL,
    });

    const [state, setState] = useState({
      name: "",
      event: "",
      description: "",
      actionType: "",
      referenceID: "",
      archiveIn: "",
      purgeIn: "",
      createdBy: "",
      isEnabled: "",
    });

    const [pageNumber, setPageNumber] = useState(1);
    const [limit, setLimit] = useState(10);

    // const [modifiedDate, setModifiedDate] = React.useState(new Date());
    // const [createdDate, setCreatedDate] = React.useState(new Date());

    // const handleModifiedDateChange = (date) => {
    //   setModifiedDate(date);
    // };
    // const handleCreatedDateChange = (date) => {
    //   setCreatedDate(date);
    // };

    const useStyles = makeStyles((theme) => ({
      root: {
        width: "100%",
      },
      heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: "33.33%",
        flexShrink: 0,
      },
      secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
      },
    }));
    const classes = useStyles();

    const handleTextFieldChange = (e) => {
      const { name, value } = e.target;
      setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleIsEnabledChange = (e) => {
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
      e.preventDefault();
      //setIsAdvancedSearch(!isAdvancedSearch);
      console.log("Clicked Reset Button");
      callResetData();
    };

    const isEmpty = (str) => {
      return !str || 0 === str.length;
    };

    const handleApplyClick = (event) => {
      event.preventDefault();
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

      console.log("handleApplyClick");

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
        pageNumber +
        "&" +
        "limit=" +
        limit;

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

      url.search = params.toString();

      console.log("url = ", url);

      search(url.href);
    };

    return (
      <div>
        <WrappedComponent
          onhandleTextFieldChange={(event) => handleTextFieldChange(event)}
          onhandleIsEnabledChange={handleIsEnabledChange}
          onhandleApplyClick={(event) => handleApplyClick(event)}
          onhandleResetClick={(event) => handleResetClick(event)}
        />
      </div>
    );
  };

  return NewComponent;
};

export default HOC;
