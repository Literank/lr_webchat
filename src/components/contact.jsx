import React from "react";
import "./Contact.css";

const Contact = (props) => {
  return (
    <div className="contact" onClick={props.onClick}>
      {props.notify && <div className="notify-dot"></div>}
      <div className="name truncate">{props.username}</div>
      <div className="last-message truncate">
        {props.message || "[no messages]"}
      </div>
    </div>
  );
};

export default Contact;
