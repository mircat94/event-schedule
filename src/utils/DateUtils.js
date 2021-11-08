/** @format */

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const weekDay = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

const monthName = (m) => months[m];
const weekDayName = (m) => weekDay[m];

export { months, monthName, weekDayName };
