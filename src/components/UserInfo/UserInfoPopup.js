import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userSignOut } from "actions/Auth";
import IntlMessages from "util/IntlMessages";
import { useHistory } from "react-router-dom";
import DosandDontComponent from "../../app/routes/widgets/routes/CommonComponents/DosandDont";
import {getDos,getDnot} from "../../setup/ApplicatoinConfigurations"



const UserInfoPopup = () => {
  const dispatch = useDispatch();

  const { authUser } = useSelector(({ auth }) => auth);
  let data = authUser.userDetails;

  const [state, setState] = useState({
    DialogOpen:false,
    dos:[],
    dont:[],
     })

  


  let history = useHistory();

  const handleSetting = () => {
    history.push("/app/widgets/Settings");
  };

  const UserProfile = () => {
    history.push("/app/widgets/UserProfile");
  };

  const handleDND =()=>{
    let dosString = getDos()
    let doNotString = getDnot()
    setState((prevState) => ({
      ...prevState,
      DialogOpen: true,
      dont: doNotString,
      dos: dosString,
    }));
  }

  const handle_RequestClose =()=>{
    setState((prevState) => ({
      ...prevState,
      DialogOpen: false
    }));
  }



  return (
    <div>
      <div className="user-profile">
        <img
          className="user-avatar border-0 size-40 rounded-circle"
          src="https://via.placeholder.com/150x150"
          alt="User"
        />
        <div className="user-detail ml-2">
          <h4 className="user-name mb-0">{data && data.fullName}</h4>
          <small>{data && data.username}</small><br></br>
          <small>{data && data.roleName}</small>
          {/* <small>Administrator</small> */}
        </div>
      </div>
      
      {data && data.spCode ?
        <div className="user-profile">        
          <div className="user-detail ml-2">
            <h4 className="user-name mb-0">SP Details</h4>
            <div><small>{data && data.spName}</small></div>     
            <div><small>{data && data.spCode}</small></div>          
          </div>
        </div> : <div></div>
      }

      <span className="jr-link dropdown-item text-muted" onClick={UserProfile}>
        <i className="zmdi zmdi-face zmdi-hc-fw mr-1" />
        <IntlMessages id="popup.profile" />
      </span>
      <span
        className="jr-link dropdown-item text-muted"
        onClick={handleSetting}
      >
        <i className="zmdi zmdi-settings zmdi-hc-fw mr-1" />
        <IntlMessages id="popup.setting" />
      </span>
      <span
        className="jr-link dropdown-item text-muted"
      onClick={handleDND}
      >
        <i className="zmdi zmdi-assignment zmdi-hc-fw mr-1" />
       
        <IntlMessages id="popup.DnD" />
      </span>
      <span
        className="jr-link dropdown-item text-muted"
        onClick={() => {
          dispatch(userSignOut());
        }}
      >
        <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-1" />
        <IntlMessages id="popup.logout" />
      </span>
      <DosandDontComponent
      DialogOpen={state.DialogOpen}
      handle_RequestClose={handle_RequestClose}
      DosData={state.dos}
      DnotData={state.dont}
      />

      {/* <Dialog
        maxWidth="sm"
        open={state.DialogOpen}
        onClose={handle_RequestClose}
      >
        {DnDContent}
      </Dialog> */}
    </div>
   

  );
};

export default UserInfoPopup;
