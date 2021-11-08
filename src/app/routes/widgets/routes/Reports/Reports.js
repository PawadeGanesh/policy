import React, { useEffect, useState } from "react";
import IntlMessages from "util/IntlMessages";
import CardBox from "./../../../../../components/CardBox";
import Iframe from 'react-iframe'
import {
  apigetUrl,
  apipostUrl,
  apiputUrl,
  apideleteUrl,
  apireportgetUrl
} from "../../../../../setup/middleware";
import { getReports } from "../../../../../setup/ApplicatoinConfigurations.js";
import "./report.css"

  const Reports = ({ currentKey }) => {  
    const [state, setState] = useState({
      tokenKeyString:"",
      enableIframe:true,
    })
    
    useEffect(() => {
      callLocalBaseURL()
    }, []);

    const callLocalBaseURL = async () => {
      const result = await apipostUrl(`/auth/short-token`);
      if (result.status === 200 ||result.status === 201) {
        setState((prevState) => ({
          ...prevState,
          tokenKeyString:result.data.shortToken,
          enableIframe:true,
        }));
      } else {
      }
    };

    return (
    <>
 {state.enableIframe ? (
    <Iframe src={`${getReports()}${currentKey}&tokenKey=${state.tokenKeyString}`}
        width="100%"
        height="465px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
        frameBorder="0"
        />
  ):null}
   
    </>
  );
};

export default Reports;
