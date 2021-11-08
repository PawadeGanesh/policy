import React from "react";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import moment from "moment";
import {TextField} from "@material-ui/core";
import InputDatePicker from "../../../widgets/routes/CommonComponents/DatePicker";

const DobDatePicker = (props) => {
  // console.log("DateFormate", props);
  // const [selectedDate, handleDateChange] = useState(null);

  return (
    <>
      <InputDatePicker
        isTimePicker={props.isTimePicker}
        filterDate={(d) => {
          return new Date() > d;
        }}
        {...props}
        placeholderText={props.label}
        selected={props.value ? new Date(props.value) : null}
        onChange={(e) => {
          let formatString = props.isTimePicker ? "yyyy-MM-d hh:mm:ss" : "YYYY-MM-DD";
          props.onChange({
            target: {
              name: props.name,
              value: e ? moment(e).format(formatString) : null,
            },
          })
        }
        }
        customInput={<TextField 
          style={{width:"100%"}}
          variant="outlined"
          />}
      />
    </>
  );
};

export default DobDatePicker;
