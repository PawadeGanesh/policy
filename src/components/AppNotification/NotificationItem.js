import React, { useState, useEffect } from "react";
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button';
import axios from "axios";
import apiInstance from "../../setup/index"
import {useSelector} from 'react-redux'
import {apigetUrl,apipostUrl,apiputUrl} from"../../setup/middleware"
import { async } from "q";

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const NotificationItem = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  let data = authUser.userDetails;
  let user = data;
  const [state, setState] = useState({
    data: [],
    page: 1,
    limit: 5,
    mode:"det",
    status:0,
  })

  useEffect(() => {
      getdata()
  }, [])

  const getdata = async () => {
    const result =await apigetUrl(`/notify/notifications/user/${user && user.username}?page=${state.page}&limit=${state.limit}&status=${state.status}&mode=${state.mode}`)
      if(result.data.responseCode==="200"){  
        let dataresult=[]
        let datafilter = result.data.dataList;
        let datalength = result.data.dataList.length;
       if(datalength==0){
        dataresult.push({"title":"No new notification, Click on view all to view older notifications."})
       }
        else if(datalength<=5){
          dataresult.length=0
        if(datalength!=5){
        for(let i=0;i<datalength;i++){
          dataresult.push(datafilter[i])
        }
      }
      else if(datalength==5){
        dataresult.length=0
        for(let i=0;i<5;i++){
          dataresult.push(datafilter[i])
        }
      }
      
      }
        setState((prevState) => ({
          ...prevState,
          data: dataresult,
        }));
     
      }
      else{ 
        let dataresult=[]
        dataresult.push({"title":result.data.responseMessage})
        setState((prevState) => ({
          ...prevState,
          data:dataresult ,
        }));
      }
  };
  return (
    <>
    {state.data.map((n, i) => {
      return (
        <li className="media" key={i}>
        <div className="media-body align-self-center">
          <p className="sub-heading mb-0">{n.title}</p>
        </div>
      </li>
      )
    })}
 
    </>
  );
};

export default NotificationItem;
