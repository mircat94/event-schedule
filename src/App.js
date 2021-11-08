import "./App.css";
import React, { useState } from "react";
import users from "./data/users.json";
import events from "./data/events.json";
import _ from "lodash";

import { Box, Typography, Paper, TextField, Chip } from "@material-ui/core";
import { Autocomplete, Button, Alert } from "@mui/material";
import { DateTime } from "./components/DateTime";
import { weekDayName } from "./utils/DateUtils";
import { AvailableTimes } from "./components/AvailableTimes";
import MeetingScheduleConfirm from "./components/MeetingScheduleConfirmation";

const merge = (eventIntervals) => {
  if (eventIntervals.length < 2) return eventIntervals;

  eventIntervals.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  const result = [];
  let previous = eventIntervals[0];

  for (let i = 1; i < eventIntervals.length; i += 1) {
    if (previous[1] >= eventIntervals[i][0]) {
      const max = _.max([previous[1], eventIntervals[i][1]]);

      previous = [previous[0], max];
    } else {
      result.push(previous);
      previous = eventIntervals[i];
    }
  }

  result.push(previous);

  return result;
};
function getOpenSlots(schedule) {
  var res = [];

  if (schedule.length <= 1) {
    return schedule;
  }
  if (new Date(schedule[0][0]) > new Date("2021-07-05T13:00:00")) {
    res.push(["2021-07-05T13:00:00", schedule[0][0]]);
  }

  schedule.forEach((curr, i) => {
    var prev = schedule[i - 1];

    var isTimeBetween = prev && prev[1] !== curr[0];

    if (i > 0 && isTimeBetween) {
      if (new Date(prev[1]).getDate() === new Date(curr[0]).getDate()) {
        res.push([prev[1], curr[0]]);
      }
    }
  });
  if (
    new Date(schedule[schedule.length - 1][1]) < new Date("2021-07-07T21:00:00")
  ) {
    res.push([schedule[schedule.length - 1][1], "2021-07-07T21:00:00"]);
  }

  return res;
}
const validateSelectedDates = (
  availableTimes,
  selectedDate,
  selectedStartTime,
  selectedEndTime
) => {
  let errors = [];
  if (availableTimes) {
    if (selectedDate !== "") {
      let passingDateRange = [];
      availableTimes.forEach((dateRange) => {
        var from = new Date(dateRange[0]);
        from.setHours(0, 0, 0, 0);
        var to = new Date(dateRange[1]);
        to.setHours(0, 0, 0, 0);
        var check = new Date(selectedDate);
        check.setHours(0, 0, 0, 0);
        console.log({ from, to, check });
        if (check >= from && check <= to) {
          passingDateRange.push(dateRange);
        }
      });
      if (passingDateRange.length === 0) {
        errors.push(
          `Selected date ${
            format(selectedDate).monthDate
          } not within available date range.`
        );
      } else {
        if (selectedStartTime !== "" && selectedEndTime !== "") {
          let passingTimeRange = [];
          let timeErrors = [];
          passingDateRange.forEach((range) => {
            var startTime = format(selectedStartTime).hM;
            var endTime = format(selectedEndTime).hM;
            var fromTime = format(range[0]).hM;
            var toTime = format(range[1]).hM;
            let startPassed = startTime >= fromTime && startTime <= toTime;
            let endPassed = endTime >= fromTime && endTime <= toTime;
            if (startPassed && endPassed) {
              passingTimeRange.push(range);
            } else {
              if (startPassed && !endPassed) {
                timeErrors.push(
                  `Selected end time ${
                    format(endTime).timeHM
                  } not within available time range`
                );
              }
              if (!startPassed && endPassed) {
                timeErrors.push(
                  `Selected start time ${
                    format(startTime).timeHM
                  } not within available time range`
                );
              }
              if (!startPassed && !endPassed) {
                timeErrors.push(
                  `Selected start time ${
                    format(startTime).timeHM
                  } and end time ${
                    format(endTime).timeHM
                  } not within available range`
                );
              }
            }
          });

          if (passingTimeRange.length === 0) {
            console.log({ timeErrors });
            errors = [...errors, timeErrors[0]];
          }
        } else {
          if (selectedStartTime === "") {
            errors.push("Please add start time");
          }
          if (selectedEndTime === "") {
            errors.push("Please add end time");
          }
        }
      }
    } else {
      errors.push("Please select date");
    }
  } else {
    errors.push("No available times for this user.");
  }
  return errors;
};
function getDetails(selectedUsers, userEvents) {
  let allEventsScheduled = [];
  console.log(selectedUsers);
  if (selectedUsers.length > 0) {
    selectedUsers.map((user) => {
      user.events = userEvents.filter((e) => e.user_id === user.id);
      allEventsScheduled = [...allEventsScheduled, ...user.events];
    });

    const unavailableTimes = merge(
      allEventsScheduled.map((d) => {
        return [d.start_time, d.end_time];
      })
    );

    const availableTimes = getOpenSlots(unavailableTimes);
    console.log(availableTimes);

    return { allEventsScheduled, unavailableTimes, availableTimes };
  } else {
    return {
      allEventsScheduled: null,
      unavailableTimes: null,
      availableTimes: null,
    };
  }
}

const timeObj = (d) => {
  var parts = d.split(":"),
    date = new Date();

  date.setHours(parts[0]);
  date.setMinutes(parts[1]);
  return date;
};
export const format = (d) => {
  let date_ob = new Date(d);
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = ("0" + date_ob.getMinutes()).slice(-2);
  let seconds = date_ob.getSeconds();
  let day = weekDayName(date_ob.getDay());
  let hM = timeObj(`${hours > 12 ? hours - 12 : hours}:${minutes}`);
  return {
    date,
    month,
    monthDate: month + "/" + date,
    yearMonthDay: year + "-" + month + "-" + date,
    monthDateYear: month + "/" + date + "/" + year,
    time: `${hours > 12 ? hours - 12 : hours}:${minutes}${
      seconds ? `:${seconds}` : ""
    } ${hours >= 12 ? "PM" : "AM"}`,
    timeHM: `${hours > 12 ? hours - 12 : hours}:${minutes}`,
    year,
    hours,
    dayMonthDate: day + ", " + month + "/" + date,
    dayMonthDateTime:
      day +
      ", " +
      month +
      "/" +
      date +
      " " +
      `${hours > 12 ? hours - 12 : hours}:${minutes}`,
    day: day,
    minutes,

    date_ob,
    seconds,
    hM,
  };
};

function App() {
  const [userEvents, setUserEvents] = useState(events);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [showMeetingScheduled, setShowMeetingScheduled] = useState(false);
  const [meetingScheduled, setMeetingScheduled] = useState("");
  const handleSelectUsers = (users) => {
    setSelectedUsers(users);
  };
  const handleSetStartTime = (time) => {
    setSelectedStartTime(time);
  };
  const handleSetEndTime = (time) => {
    setSelectedEndTime(time);
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  const addEvent = () => {
    const date = format(selectedDate).yearMonthDay;
    const hours = format(selectedStartTime).hours;
    const minutes = format(selectedStartTime).minutes;
    const endHours = format(selectedEndTime).hours;
    const endMin = format(selectedEndTime).minutes;

    const start = date + "T" + hours + ":" + minutes + ":00";
    const end = date + "T" + endHours + ":" + endMin + ":00";

    let newEvents = [...events];
    selectedUsers.forEach((user) => {
      newEvents.push({
        id: newEvents.length,
        user_id: user.id,
        start_time: start,
        end_time: end,
      });
    });
    const formattedStart = format(start).time;
    const formattedEnd = format(end).time;

    setShowMeetingScheduled(true);

    setMeetingScheduled({
      users: selectedUsers.map((user) => user.name).join(", "),
      day: format(start).dayMonthDate,
      startTime: formattedStart,
      endTime: formattedEnd,
    });
    setUserEvents([...newEvents]);
  };

  const resetSchedule = () => {
    setSelectedUsers([]);
    setSelectedDate("");
    setSelectedStartTime("");
    setSelectedEndTime("");
    setMeetingScheduled("");
    setShowMeetingScheduled(false);
  };
  const { allEventsScheduled, unavailableTimes, availableTimes } = getDetails(
    selectedUsers,
    userEvents
  );
  const errors = validateSelectedDates(
    availableTimes,
    selectedDate,
    selectedStartTime,
    selectedEndTime
  );
  if (showMeetingScheduled) {
    return (
      <MeetingScheduleConfirm
        meetingScheduled={meetingScheduled}
        resetSchedule={resetSchedule}
      />
    );
  } else {
    return (
      <div className="App">
        <Paper elevation={3} style={{ margin: "10%", padding: "32px" }}>
          <Typography variant={"h5"} align="left">
            Meeting Scheduler
          </Typography>
          <Typography variant={"subtitle1"} align="left">
            Add required peope to see available time
          </Typography>
          <Box style={{ margin: "16px 0px", padding: "16px 0px" }}>
            <Autocomplete
              multiple
              id="tags-standard"
              options={users}
              onChange={(event, option) => handleSelectUsers(option)}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="Add people" />
              )}
            />
          </Box>
          {availableTimes && (
            <>
              <AvailableTimes availableTimes={availableTimes} />

              <DateTime
                handleDateChange={handleDateChange}
                selectedDate={selectedDate}
                handleSetStartTime={handleSetStartTime}
                selectedStartTime={selectedStartTime}
                handleSetEndTime={handleSetEndTime}
                selectedEndTime={selectedEndTime}
              />

              <Box
                style={{
                  paddingTop: "32px",
                  marginTop: "32px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button disabled={errors.length > 0} onClick={addEvent}>
                  {" "}
                  Add Event{" "}
                </Button>
              </Box>
              {errors &&
                selectedDate !== "" &&
                selectedStartTime !== "" &&
                selectedEndTime !== "" &&
                errors.map((error, index) => (
                  <Alert severity="error" key={index}>
                    {error}
                  </Alert>
                ))}
            </>
          )}
        </Paper>
      </div>
    );
  }
}

export default App;
