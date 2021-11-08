import React from "react";
import Widget from "components/Widget";


let Contact = ({
  UserProfileData
}) => {
  return (
    <Widget title="Contact" styleName="jr-card-profile-sm">
    {(UserProfileData.contactList||[]).map((data, index) =>
        <div key={index} className="media align-items-center flex-nowrap jr-pro-contact-list">
          <div className="mr-3">
            <i className={`zmdi zmdi-${data.icon} jr-fs-xxl text-grey`}/>
          </div>
          <div className="media-body">
            <span className="mb-0 text-grey jr-fs-sm">{data.title}</span>
            <p className="mb-0">{data.desc}</p>
          </div>
        </div>
      )}
    </Widget>
  )
}
export default Contact;


