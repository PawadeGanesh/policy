import React from "react";
import { DatePicker, DateTimePicker } from "@material-ui/pickers";
import moment from "moment";

const DobDatePicker = (props) => {
  // const [selectedDate, handleDateChange] = useState(null);

  return (
    <div key="basic_day">
      {props.isTimePicker ? (
        <DateTimePicker
          {...props}
          disableFuture
          openTo="year"
          format="yyyy-MM-d hh:mm:ss"
          label={props.label}
          value={props.value || null}
          onChange={(e) =>
            props.onChange({
              target: {
                name: props.name,
                value: moment(e).format("yyyy-MM-d hh:mm:ss"),
              },
            })
          }
          animateYearScrolling={false}
        />
      ) : (
        <DatePicker
          {...props}
          disableFuture
          openTo="year"
          format="DD-MMM-yyyy"
          label={props.label}
          views={["year", "month", "date"]}
          value={props.value || null}
          onChange={(e) =>
            props.onChange({
              target: {
                name: props.name,
                // value: moment(e).format("yyyy-MM-d"),
                value: moment(e).format("YYYY-MM-DD"),
              },
            })
          }
          animateYearScrolling={false}
        />
      )}
    </div>
  );
};

export default DobDatePicker;
