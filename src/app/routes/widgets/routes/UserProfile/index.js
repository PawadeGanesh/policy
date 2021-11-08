import React, { useState, useEffect } from "react";
import About from "./About";
import Contact from "./Contact";
import Achivement from "./Achivement";
import Training from "./Training";
import ProfileHeader from "./ProfileHeader";
import Auxiliary from "../../../../../util/Auxiliary";
import { apigetUrl, apiputUrl } from "../../../../../setup/middleware";
import Loader from "../CommonComponents/Loader";
import moment from "moment";


const UserProfile = () => {
  const [state, setState] = useState({
    data: [],
    isLoading: true,
    Mytraining:[],
    Mycertificate:[],
   
  })
  useEffect(() => {
    loadTrainingData()
  }, []);

  let location1=""
  let location2=""
  let location3=""
  let location4=""


//load Training
const loadTrainingData=async()=>{
  let trainingArray=[]
  let certificateArray=[]
  const result = await apigetUrl(`/otm/my/trainings?page=1&limit=10000`);
  if (result.status === 200) {
    let resultdata= result.data.dataList
    let completedTraining = resultdata.filter(a=>a.progress===100)
    
    if(resultdata.length===0){
      let trainingData = {
        "name":"No Training In-Progress",
        "date":"",
        "status":0,
        "isActive":false,
      }
      let cretificateData = {
        "name":"No Certificate's Achived",
        "date":"",
        "status":0,
        "isActive":false,
    }
      trainingArray.push(trainingData)
      certificateArray.push(cretificateData)
      setState((prevState) => ({
        ...prevState,
        Mytraining:trainingArray,
        Mycertificate:certificateArray,
      }));
    }

    else if(resultdata.length!=0) {
      
      for(let i=0;i<resultdata.length;i++){
        if(resultdata[i].progress===100){}
        else{
        let trainingData = {
          "name":resultdata[i].shortName,
          "date":(moment(resultdata[i].endDate).format("DD-MMM-yyyy")),
          "status":resultdata[i].progress,
          "isActive":true,
      }
      trainingArray.push(trainingData)
    }
      }
      setState((prevState) => ({
        ...prevState,
        Mytraining:trainingArray,
      }));
    }

   

    loadCretificateData(completedTraining)
    
  }
  else{
    let trainingData = {
      "name":"No Training In-Progress",
      "date":"",
      "status":0,
      "isActive":false,
    }
    let cretificateData = {
      "name":"No Certificate's Achived",
      "date":"",
      "status":0,
      "isActive":false,
  }
    trainingArray.push(trainingData)
    certificateArray.push(cretificateData)
    setState((prevState) => ({
      ...prevState,
      Mytraining:trainingArray,
      Mycertificate:certificateArray,
    }));
  }
  loadUserData()
}


const loadCretificateData=(completedTraining)=>{
  let certificateArray=[]
  if(completedTraining.length===0){
    let cretificateData = {
      "name":"No Certificate's Achived",
      "date":"",
      "status":0,
      "isActive":false,
  }
  certificateArray.push(cretificateData)
  }

else if(completedTraining.length>0){
    for(let i=0;i<completedTraining.length;i++){
      let cretificateData = {
        
        "name":completedTraining[i].shortName,
        "date":(moment(completedTraining[i].endDate).format("DD-MMM-yyyy")),
        "status":completedTraining[i].progress,
        "isActive":true,
    }
    certificateArray.push(cretificateData)
    }
  }

  

setState((prevState) => ({
    ...prevState,
    Mycertificate:certificateArray,
  }));
  
  
  loadUserData()
}

//load user api
const loadUserData=async()=>{
  const result = await apigetUrl(`/auth/login/my/profile`);
  if (result.status === 200) {
    let data = result.data
  let userlocation = data.userLocation
  let level1 =userlocation.level1Id
  let level2 =userlocation.level2Id
  let level3 =userlocation.level3Id
  let level4 = userlocation.level4Id
  if(level1===null&&level2===null&level3===null&level4===null){
    location1=""
  location2=""
  location3=""
  location4=""
  displayUserData(data)
  }
  else{
  getLocation1(level4,level3,level2,level1,data)
  }
  }
}

//loction1
const getLocation1 = async(level1,level2,level3,level4,data) => {
  apigetUrl(`/auth/locations?parentId=${1}&page=1&limit=1000`)
    .then((res) => {
      let result = res.data.dataList
      for(var i=0;i<result.length;i++){
        if(result[i].id===parseInt(level1)){
         location1= result[i].name
         getLocation2(level1,level2,level3,level4,data)
        }
      }
      if(location1===""||location1===null||location1===undefined){
        getLocation2(level1,level2,level3,level4,data)
      }
    })
    .catch((err) => console.log("err", err));
};

//loction2
const getLocation2 = async(level1,level2,level3,level4,data) => {
  apigetUrl(`/auth/locations?parentId=${level1}&page=1&limit=1000`)
    .then((res) => {
      let result = res.data.dataList
      for(var i=0;i<result.length;i++){
        if(result[i].id===parseInt(level2)){
          location2= result[i].name
          getLocation3(level1,level2,level3,level4,data)
        }
      }
      if(location2===""||location2===null||location2===undefined){
        getLocation3(level1,level2,level3,level4,data)
      }
    })
    .catch((err) => console.log("err", err));
};

//loction3
const getLocation3 = async(level1,level2,level3,level4,data) => {
  apigetUrl(`/auth/locations?parentId=${level2}&page=1&limit=1000`)
    .then((res) => {
      let result = res.data.dataList
      for(var i=0;i<result.length;i++){
        if(result[i].id===parseInt(level3)){
          location3= result[i].name
          getLocation4(level1,level2,level3,level4,data)
        }
      }
      if(location3===""||location3===null||location3===undefined){
        getLocation4(level1,level2,level3,level4,data)
      }
    })
    .catch((err) => console.log("err", err));
};

//loction4
const getLocation4 = async(level1,level2,level3,level4,data) => {
  apigetUrl(`/auth/locations?parentId=${level3}&page=1&limit=1000`)
    .then((res) => {
      let result = res.data.dataList
      for(var i=0;i<result.length;i++){
        if(result[i].id===parseInt(level4)){
          location4= result[i].name
          displayUserData(data)
        }
      }
      if(location4===""||location4===null||location4===undefined){
        displayUserData(data)
      }
    })
    .catch((err) => console.log("err", err));
};


//display data
const displayUserData=async(data)=>{
  let fName = ""
  let lName = ""
  let emailid = ""
  let mobile = ""
  let policy = 0
  let customer = 0
  let enquiry = 0
  if(data.firstName===null||data.firstName===undefined){fName=""}else{fName = data.firstName}
  if(data.lastName===null||data.lastName===undefined){lName=""}else{lName = data.lastName}
  if(data.email===null||data.email===undefined||data.email==="false"){emailid=""}else{emailid = data.email}
  if(data.mobileNumber===null||data.mobileNumber===undefined){mobile=""}else{mobile = data.mobileNumber}
  if(data.totalPolicy===null||data.totalPolicy===undefined){policy=0}else{policy = data.totalPolicy}
  if(data.totalCustomer===null||data.totalCustomer===undefined){customer=0}else{customer = data.totalCustomer}
  if(data.totalFeedback===null||data.totalFeedback===undefined){enquiry=0}else{enquiry = data.totalFeedback}
  
  const UserProfileData = 
      {
        policyTotalNumber: policy,
        customerTotalNumber:customer,
        feedback: enquiry,
        firstName: fName,
        lastName: lName,
        aboutList: [
          {
            id: 1,
            title: 'Zone',
            icon: 'city-alt',
            desc: [location1||"All"]
          },
          {
            id: 2,
            title: 'State',
            icon: 'city-alt',
            desc: [location2||"All"]
          },
          {
            id: 3,
            title: 'Cluster',
            icon: 'city-alt',
            desc: [location3||"All"]
          },
          {
            id: 4,
            title: 'District',
            icon: 'city-alt',
            desc: [location4||"All"]
          },
        ],
        contactList: [
          {
            id: 1,
            title: 'Email',
            icon: 'email',
            desc: [emailid]
          },
          {
            id: 2,
            title: 'Phone',
            icon: 'phone',
            desc: [(mobile).toString()]
          },
        ]
      }
    

    setState((prevState) => ({
      ...prevState,
      data: UserProfileData,
      isLoading: false,
    }));
  
}

  return (
    <Auxiliary>
       {state.isLoading===true ? (
        <Loader />
       ):(
         <>
      <ProfileHeader UserProfileData={state.data}/>
      <div className="jr-profile-content">
        <div className="row">
          <div className="col-xl-8 col-lg-8 col-md-7 col-12">
            <About UserProfileData={state.data}/>
          </div>
          <div className="col-xl-4 col-lg-4 col-md-5 col-12">
            <Contact UserProfileData={state.data}/>
          </div>
        </div>
        <div className="row">
        <div className="col-lg-6">
        <Achivement UserProfileData={state.Mycertificate}/> 
        </div>
        <div className="col-lg-6">
        <Training UserProfileData={state.Mytraining}/>
        </div>
        </div>
      </div>
      </>
       )
       }
    </Auxiliary>
  );
};

export default UserProfile;


