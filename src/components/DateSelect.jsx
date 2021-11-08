import * as React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateSelect({ selectedDate, handleChange }) {
  return (
    <DatePicker
      className={
        "MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedEnd"
      }
      selected={selectedDate}
      onChange={handleChange}
      minDate={new Date("2021-07-06")}
      maxDate={new Date("2021-07-08")}
      dateFormat="MM/dd/yyyy"
    />
  );
}
