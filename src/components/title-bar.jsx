import React from "react";
import "./TitleBar.css";

const TitleBar = (props) => {
  return <div className="title">{props.username}</div>;
};

export default TitleBar;
