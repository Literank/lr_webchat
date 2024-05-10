import React from "react";
import "./Message.css";
import clsx from "clsx";

const Message = (props) => {
  return (
    <div className={clsx("wrapper", { "self-side": props.isSelf })}>
      <div className="message">
        <div className="meta">{props.username}</div>
        <div className="bubble">{props.message}</div>
      </div>
    </div>
  );
};

export default Message;
