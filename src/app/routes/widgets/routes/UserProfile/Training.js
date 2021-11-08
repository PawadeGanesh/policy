import React, {useState} from "react";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Widget from "components/Widget/index";
import DisplayMyTrainingData from "./DisplayMyTrainingData";


let Training = ({
 UserProfileData
}) => {

  const [value,setValue]=useState(0);

  const  handleChange = (event, value) => {
    setValue(value);
  };

    return (
      <Widget styleName="jr-card-full jr-card-tabs-right jr-card-profile">
        <div className="card-header">
          <h4 className="card-title mb-0">My Training's</h4>
        </div>
        <div className="jr-tabs-classic">
          <div className="jr-tabs-content jr-task-list">
            <div className="row">
              {value === 0 && (UserProfileData||[]).map((training) => 
              <div className="col-lg-4">
                <DisplayMyTrainingData data={training}/>
                </div>
              )}
            </div>
          </div>
        </div>
      </Widget>
    );
}
export default Training;

