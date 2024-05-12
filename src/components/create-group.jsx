import React, { useState } from "react";
import "./CreateGroup.css";

const CreateGroup = (props) => {
  const [userSids, setUserSids] = useState(props.pal ? [props.pal.sid] : []);
  const [groupName, setGroupName] = useState("");

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const newUserSids = userSids.filter((v) => v !== value);
    if (checked) {
      setUserSids([...newUserSids, value]);
    } else {
      setUserSids(newUserSids);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="group-title">Create Group</div>
        <div className="group-users">
          <input
            className="group-name-ipt"
            placeholder="Group name"
            onChange={(e) => setGroupName(e.target.value)}
          />
          {props.contacts.map((e, i) => (
            <label key={i} htmlFor={`option${i}`} className="contact-label">
              <input
                type="checkbox"
                id={`option${i}`}
                defaultChecked={props.pal.sid === e.sid}
                value={e.sid}
                onChange={handleChange}
              />
              {e.emoji} {e.name}
            </label>
          ))}
        </div>
        <div className="create-buttons">
          <button
            className="send-btn"
            onClick={() => {
              props.callback(userSids, groupName);
            }}
          >
            Create
          </button>
          <button className="cancel-btn" onClick={props.close}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
