import React, {useState} from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Widget from "components/Widget/index";
import DisplayAboutData from "./DisplayAboutData";


let About = ({
  UserProfileData
}) => {
  const [value,setValue]=useState(0);

  const  handleChange = (event, value) => {
    setValue(value);
  };

    return (
      <Widget styleName="jr-card-full jr-card-tabs-right jr-card-profile">
        <div className="card-header">
          <h4 className="card-title mb-0">About</h4>
        </div>
        <div className="jr-tabs-classic">
          <div className="jr-tabs-content jr-task-list">
            <div className="row">
              {value === 0 && (UserProfileData.aboutList||[]).map((about) => <div
                className="col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12">
                <DisplayAboutData data={about}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </Widget>
    );
}
export default About;

