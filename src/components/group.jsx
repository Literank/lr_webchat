import React from "react";
import "./Contact.css";

const Group = (props) => {
  return (
    <div className="contact" onClick={props.onClick}>
      {props.notify && <div className="notify-dot"></div>}
      <div className="name truncate">{props.name}</div>
      <div className="last-message truncate">
        {props.message || "[no messages]"}
      </div>
    </div>
  );
};

export default Group;
