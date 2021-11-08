import React from "react";

import TimeSelect from "./TimeSelect";

import { Typography, Box } from "@material-ui/core";
import DateSelect from "./DateSelect";
export function DateTime({
  selectedDate,
  handleDateChange,
  handleSetStartTime,
  selectedStartTime,
  handleSetEndTime,
  selectedEndTime,
}) {
  return (
    <Box style={{ margin: "16px 0px" }}>
      <Typography
        variant={"h6"}
        align="left"
        style={{ paddingTop: "16px", paddingBottom: "8px" }}
      >
        Set Event
      </Typography>
      <div style={{ display: "flex", justifyContent: "start" }}>
        <Typography
          variant="overline"
          style={{ whiteSpace: "nowrap", paddingRight: "16px" }}
        >
          {" "}
          Select date
        </Typography>
        <DateSelect
          selectedDate={selectedDate}
          handleChange={handleDateChange}
        />

        <Typography
          variant="overline"
          style={{ whiteSpace: "nowrap", paddingRight: "16px" }}
        >
          {" "}
          Start Time
        </Typography>
        <TimeSelect
          id="start-time"
          selectedTime={selectedStartTime}
          handleChange={handleSetStartTime}
        />

        <Typography
          variant="overline"
          style={{ whiteSpace: "nowrap", padding: "0px 16px" }}
        >
          End Time
        </Typography>
        <TimeSelect
          id="end-time"
          selectedTime={selectedEndTime}
          handleChange={handleSetEndTime}
        />
      </div>
    </Box>
  );
}
