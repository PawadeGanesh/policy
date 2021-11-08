import React, { useState, useEffect, useRef } from "react";
import Avatar from '@material-ui/core/Avatar';
import { IconButton } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

let ProfileHeader = ({
  UserProfileData
}) => {
  const [state, setState] = useState({
    hover: true
  })

  let inputFileRef = useRef(null);

  const mouseOver = () => {
    setState((prevState) => ({
      ...prevState,
      hover: false
    }));
  };
  const mouseOut = () => {
    setState((prevState) => ({
      ...prevState,
      hover: true
    }));
  };

  const handleChangePhotoButton = (e) => {
    e.preventDefault();
    inputFileRef.click();
  };

  return (

    <div className="jr-profile-banner">
      <div className="jr-profile-container">
        <div className="jr-profile-banner-top">
          <div className="jr-profile-banner-top-left">
            <div className="jr-profile-banner-avatar" >
            <div onMouseOver={mouseOver} onMouseOut={mouseOut}>
              {state.hover===true ? (
                <>
                <Avatar className="size-90" alt="..." src="https://via.placeholder.com/124x106" />
                </>) : (
                  <>
                  <Avatar className="size-90" alt="..." >
                  <input
                    // onChange={handleChangePhotoFileInput}
                    ref={(input) => (inputFileRef = input)}
                    style={{ display: "none" }}
                    type="file"
                  />
                    <IconButton 
                    onClick={handleChangePhotoButton}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </Avatar>
                  </>)}
                  </div>
          </div>
            <div className="jr-profile-banner-avatar-info">
              <h2 className="mb-2 jr-mb-sm-3 jr-fs-xxl jr-font-weight-light">{UserProfileData.firstName + " " + UserProfileData.lastName}</h2>
            </div>
          </div>
          <div className="jr-profile-banner-top-right">
            <ul className="jr-follower-list">
              <li>
                <span className="jr-follower-title jr-fs-lg jr-font-weight-medium">{UserProfileData.policyTotalNumber}</span>
                <span className="jr-fs-sm">Policies</span></li>
              <li>
                <span className="jr-follower-title jr-fs-lg jr-font-weight-medium">{UserProfileData.customerTotalNumber}</span>
                <span className="jr-fs-sm">Customers</span></li>
              <li>
                <span className="jr-follower-title jr-fs-lg jr-font-weight-medium">{UserProfileData.feedback}</span>
                <span className="jr-fs-sm">Average Feedback</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

  )
}
export default ProfileHeader;


