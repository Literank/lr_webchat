import React from "react";
import "./Contact.css";
import clsx from "clsx";

const Contact = (props) => {
  return (
    <div className={clsx("contact", { offline: props.isOffline })}>
      <div className="name truncate">{props.username}</div>
      <div className="last-message truncate">{props.message}</div>
    </div>
  );
};

export default Contact;
