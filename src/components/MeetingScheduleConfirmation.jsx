import React from "react";
import { Typography, Paper, Button } from "@material-ui/core";

const MeetingScheduleConfirm = ({ meetingScheduled, resetSchedule }) => {
  const { day, startTime, endTime, users } = meetingScheduled;
  return (
    <div className="App">
      <Paper elevation={3} style={{ margin: "10%", padding: "32px" }}>
        <Typography variant={"h2"} align="center">
          Meeting Scheduled!
        </Typography>

        <Typography
          variant={"h5"}
          align="center"
          style={{ padding: "16px 0px 8px 0px" }}
        >
          {day} {startTime} - {endTime}
        </Typography>
        <Typography
          variant={"h6"}
          align="center"
          style={{ padding: "8px 0px 16px 0px" }}
        >
          Users Invited: {users}
        </Typography>
        <Button onClick={resetSchedule}> Schedule another event </Button>
      </Paper>
    </div>
  );
};

export default MeetingScheduleConfirm;
