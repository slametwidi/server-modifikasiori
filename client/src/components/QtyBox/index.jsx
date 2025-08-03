import { Button } from '@mui/material';
import React from 'react';
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export const QtyBox = ({ value, onChange }) => {
  const plusQty = () => {
    onChange(value + 1);
  };

  const minusQty = () => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  return (
    <div className="qtyBox flex items-center relative">
      <input
        type="number"
        className="w-full h-[40px] p-2 pl-5 text-[15px] focus:outline-none border border-[rgba(0,0,0,0.2)] rounded-md"
        value={value}
        onChange={(e) => {
          const val = Number(e.target.value);
          if (val >= 1) onChange(val);
        }}
      />

      <div className="flex items-center flex-col justify-between h-[40px] absolute top-0 right-0 z-50">
        <Button
          className="!min-w-[25px] !w-[25px] !h-[20px] !text-black hover:!bg-[#f1f1f1]"
          onClick={plusQty}
        >
          <FaChevronUp className="text-[12px] opacity-50" />
        </Button>
        <Button
          className="!min-w-[25px] !w-[25px] !h-[20px] !text-black hover:!bg-[#f1f1f1]"
          onClick={minusQty}
        >
          <FaChevronDown className="text-[12px] opacity-50" />
        </Button>
      </div>
    </div>
  );
};
