import React from "react";
import { Box, Typography, Chip } from "@material-ui/core";
import { format } from "../App";
export function groupByNestedValueAndReturnObject(xs, key, secondaryKey) {
  return xs.reduce(function (rv, x) {
    (rv[x[key][secondaryKey]] = rv[x[key][secondaryKey]] || []).push(x);
    return rv;
  }, {});
}

export const AvailableTimes = ({ availableTimes }) => {
  const times = availableTimes.map((times) => {
    return [format(times[0]), format(times[1])];
  });

  const group = groupByNestedValueAndReturnObject(times, 0, "dayMonthDate");

  return (
    <React.Fragment>
      <Typography
        variant={"h6"}
        align="left"
        style={{ paddingTop: "16px", paddingBottom: "8px" }}
      >
        Available Times
      </Typography>
      {Object.keys(group).map((day, index) => (
        <Box
          style={{
            textAlign: "left",
          }}
          key={index}
        >
          <Typography
            variant="body2"
            key={index}
            component="div"
            align={"left"}
          >
            <span className={"day-label"}> {day}</span>
          </Typography>
          <Box style={{ display: "flex", padding: "8px 0px" }}>
            {group[day].map((availableTimes, index) => (
              <div style={{ paddingRight: "8px" }}>
                <Chip
                  key={index + day}
                  variant={"outlined"}
                  color={"primary"}
                  label={
                    <>
                      {availableTimes[0].time} -{availableTimes[1].time}
                    </>
                  }
                />
              </div>
            ))}{" "}
          </Box>
        </Box>
      ))}
    </React.Fragment>
  );
};
