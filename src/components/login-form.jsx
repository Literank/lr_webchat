import React, { useState } from "react";
import "./Login.css";

const emojis = [
  "🐨", // Koala
  "🐒", // Monkey
  "🐼", // Panda
  "🐘", // Elephant
  "🐬", // Dolphin
  "🐻", // Bear
  "🐶", // Dog
  "🐱", // Cat
  "🐭", // Mouse
  "🐰", // Rabbit
  "🦊", // Fox
  "🦁", // Lion
  "🐯", // Tiger
  "🐮", // Cow
  "🐗", // Boar
  "🐴", // Horse
  "🐑", // Sheep
  "🐺", // Wolf
  "🐹", // Hamster
  "🐻‍❄️", // Polar bear
  "🦝", // Raccoon
  "🐧", // Penguin
  "🦥", // Sloth
  "🦘", // Kangaroo
  "🦄", // Unicorn
];
const LoginForm = (props) => {
  const rndEmoji = emojis[Math.floor(emojis.length * Math.random())];
  const [emoji, setEmoji] = useState(rndEmoji);
  const [name, setName] = useState("");
  const login = () => {
    if (!emoji) {
      alert("Emoji needed.");
      return;
    }
    if (!name) {
      alert("Name needed.");
      return;
    }
    props.callback(emoji, name);
  };
  return (
    <div className="login-form">
      <div>
        <div className="form-row">
          <label>Emoji</label>
          <select
            className="input-box"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          >
            <option value="" disabled>
              Pick Your Emoji
            </option>
            {emojis.map((e, i) => (
              <option className="input-option" key={i} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label>Name</label>
          <input
            className="input-box"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                login();
              }
            }}
          />
        </div>
      </div>
      <div className="buttons">
        <button className="send-btn" onClick={login}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
