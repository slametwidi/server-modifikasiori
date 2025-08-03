import React from 'react'

const Badge = (props) => {
  return (
    <span 
    className={`inline-blok px-4 py-1 rounded-full text-[11px] capitalize 
    ${props.status === "pending" && 'bg-red-500 text-white'}
    ${props.status === "confirm" && 'bg-green-500 text-white'}
    `}
    >
    {props.status}
    </span>
  )
}

export default Badge;