import React from "react";
import "./TitleBar.css";

const TitleBar = (props) => {
  return (
    <div className="title">
      <span></span>
      <span>{props.name}</span>
      {props.isGroup ? (
        <span></span>
      ) : (
        <button
          className="create-btn"
          title="Create Group"
          onClick={props.onClick}
        >
          ➕
        </button>
      )}
    </div>
  );
};

export default TitleBar;
