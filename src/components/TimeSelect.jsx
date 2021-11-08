import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DatePicker from "react-datepicker";
import { setMinutes, setHours } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
const getTimes = () => {
  var x = 30; //minutes interval
  var times = []; // time array
  var tt = 0; // start time
  var ap = ["AM", "PM"]; // AM-PM

  //loop to increment the time and push results in array
  for (var i = 0; tt < 24 * 60; i++) {
    var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    var mm = tt % 60; // getting minutes of the hour in 0-55 format
    if (parseInt(hh) >= 13 && parseInt(hh) <= 21) {
      if (`${parseInt(hh)}:${parseInt(mm)}` !== "21:30") {
        times.push(
          ("0" + (hh % 12)).slice(-2) +
            ":" +
            ("0" + mm).slice(-2) +
            ap[Math.floor(hh / 12)]
        );
      }
    }

    tt = tt + x;
  }

  return times;
};
export default function TimeSelect({ id, handleChange, selectedTime }) {
  return (
    <DatePicker
      id={id}
      className={
        "MuiInputBase-input MuiInput-input MuiInputBase-inputAdornedEnd"
      }
      selected={selectedTime}
      onChange={handleChange}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={30}
      openToDate={setHours(setMinutes(new Date(), 0), 14)}
      minTime={setHours(setMinutes(new Date(), 0), 13)}
      maxTime={setHours(setMinutes(new Date(), 0), 21)}
      dateFormat="h:mm aa"
    />
  );
}
