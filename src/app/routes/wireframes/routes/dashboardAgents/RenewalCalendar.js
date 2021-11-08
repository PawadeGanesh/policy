import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import "./style.css";

const localizer = momentLocalizer(moment);

const baseURL = `${process.env.REACT_APP_BASE_URL}`;

const RenewalCalendar = (props) => {
  let history = useHistory();

  const handleEvent = (e) => {
    console.log("handleSelect", e.title);
    let titleString =e.title
    let typeString=""
    let renewalString =titleString.includes("Renewals")
    let newString =titleString.includes("New")
    if(renewalString===true){
      typeString="2"
    }
    else if(newString===true){
      typeString="1"
    }
    else{
      typeString="1"
    }
    console.log("handleSelect", new Date());
    history.push({
      pathname: "/app/widgets/ListOfPolicies",
      state: {
        endDate: new Date(),
        type: typeString
      },
    });
  };

  console.log("props", props);
  return (
    <>
      <div className="app-calendar animated slideInUpTiny animation-duration-3">
        <Calendar
          localizer={localizer}
          {...props}
          events={props.data}
          step={60}
          views={{ month: true, agenda: true }}
          onSelectEvent={(event) => handleEvent(event)}
          defaultDate={new Date()}
        />
      </div>
    </>
  );
};

export default RenewalCalendar;
