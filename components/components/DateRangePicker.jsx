// components/DateRangePicker.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateRangePicker({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <div className="flex items-center ">
      <DatePicker
        selected={startDate}
        onChange={date => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        className="px-3 py-2 border rounded-lg"
        dateFormat="EEE / d / MMM"
      />
      <span className="mx-2">-</span>
      <DatePicker
        selected={endDate}
        onChange={date => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        className="px-3 py-2 border rounded-lg"
        dateFormat="EEE / d / MMM"
      />
    </div>
  );
}