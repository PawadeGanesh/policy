import React from "react";
import DatePicker from "react-datepicker";
import { TextField } from "@material-ui/core";

import styled from "styled-components";
import "react-datepicker/dist/react-datepicker.css";
import { getDateTimeFormat, getDateFormat } from "../../../../../setup/ApplicatoinConfigurations.js";
const Styles = styled.div`
input::-webkit-input-placeholder {
    font-size: 15px;
    padding-left: 10px;
    text-align: left;
}  


.react-datepicker-wrapper,
  .react-datepicker__input-container, 
  .react-datepicker__input-container input {
    width: 100%;
    height: 16px;
    text-align: left;
    font-family: revert;
    font-size: medium;
    borderWidth: 0;
    border-radius:5px;
}
  // .datepickertextbox{
  //   border:1px solid #ccc
  // }
  // .react-datepicker__month-container {
  //   width: 224px;
  // }
  button {
    padding-right: 30px;
  }
  
  input{
    outline:none
    color: "white"
    border:none
    
  }
  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list {
    padding-left: unset;
    padding-right: unset;
    width: 90px;
    overflow-y: scroll;
    
}
// .react-datepicker__input-container, .react-datepicker-wrapper {
//     width:100%;
// }
// .react-datepicker {
//     width: 314px;
   
    
}
.react-datepicker .react-datepicker__day {
line-height: 1.4rem;
margin: .1rem 0.166rem;
}
.react-datepicker .react-datepicker__day-name {
line-height: 1rem;
}
 

  .react-datepicker__close-icon::before,
  .react-datepicker__close-icon::after {
    
  }
  
.react-datepicker__close-icon{
  margin-top: 10px;
}
.react-datepicker-popper {
  width: max-content;
}
  
`;

const InputDatePicker = ({
  name,
  placeholderText,
  selected,
  startDate,
  endDate,
  minDate,
  onChange,
  disabled,
  filterDate,
  isTimePicker,
  customInput
}) => {

  return (
    <>
      <Styles>
        <DatePicker
          isClearable
          filterDate={filterDate}
          name={name}
          showTimeSelect = {(isTimePicker === undefined || isTimePicker) ? true : false}
          placeholderText={placeholderText}
          dateFormat={ (isTimePicker === undefined || isTimePicker) ? getDateTimeFormat() : getDateFormat()}
          selected={selected}
          startDate={startDate}
          endDate={endDate}
          minDate={minDate}
          onChange={onChange}
          popperPlacement="bottom-start"
          disabled={disabled}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          customInput= {customInput}
        />
      </Styles>
    </>
  );
};

export default InputDatePicker;
