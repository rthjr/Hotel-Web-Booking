import React, { useState, useRef } from "react";

export default function GuestRoomPopover() {
  const [open, setOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const popoverRef = useRef();

  // Close popover when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        className="border rounded-lg px-4 py-2 bg-white shadow flex items-center min-w-[250px] justify-between"
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <span>
          {adults} adults · {children} children · {rooms} room
        </span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 left-0 mt-2 w-full bg-white rounded-xl shadow-xl p-6 flex flex-col gap-4 min-w-[320px]">
          {[
            { label: "Adults", value: adults, setValue: setAdults, min: 1 },
            { label: "Children", value: children, setValue: setChildren, min: 0 },
            { label: "Rooms", value: rooms, setValue: setRooms, min: 1 },
          ].map(({ label, value, setValue, min }) => (
            <div key={label} className="flex items-center justify-between">
              <span>{label}</span>
              <div className="flex items-center gap-2">
                <button
                  className="border rounded w-8 h-8 flex items-center justify-center text-lg"
                  onClick={() => setValue(Math.max(min, value - 1))}
                  type="button"
                >-</button>
                <span className="w-6 text-center">{value}</span>
                <button
                  className="border rounded w-8 h-8 flex items-center justify-center text-lg"
                  onClick={() => setValue(value + 1)}
                  type="button"
                >+</button>
              </div>
            </div>
          ))}
          <button
            className="border rounded w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 transition"
            onClick={() => setOpen(false)}
            type="button"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}