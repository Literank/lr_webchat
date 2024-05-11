import { useEffect, useState } from "react";
import "./App.css";
import Contact from "./components/contact";
import Message from "./components/message";
import TitleBar from "./components/ttile-bar";
import LoginForm from "./components/login-form";
import clsx from "clsx";
import io from "socket.io-client";

function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({ emoji: "", name: "" });
  const [conn, setConn] = useState(null);
  const messages = [
    {
      username: "Alice",
      message: "Hello there",
    },
    {
      username: "Bob",
      message: "How's everything?",
    },
    {
      username: "Alice",
      message: "Great! Wanna have a drink?",
    },
    {
      username: "Bob",
      message: "Sure",
    },
  ];
  const contacts = [
    {
      username: "🦁 Alice",
      message: "Sure",
    },
    {
      username: "♣ Cindy",
      message: "Where r u",
    },
    {
      username: "🐯 Doug Smith",
      message: "Hi",
    },
    {
      username: "🐴 Emily",
      message: "How's your assignment? I didn't do much yesterday",
    },
  ];
  useEffect(() => {
    const socket = io("http://localhost:4000");
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    setConn(socket);
  }, []);

  const login = (emoji, name) => {
    setUser({ emoji, name });
    setLogged(true);
  };
  return (
    <div className="app">
      <h1 className={clsx("app-name", { "center-name": !logged })}>
        Literank Web Chat
      </h1>
      {!logged ? (
        <LoginForm callback={login} />
      ) : (
        <>
          <div className="segments">
            <span className="segment left-seg picked">Chat</span>
            <span className="segment right-seg">Groups</span>
          </div>
          <div className="card">
            <div className="contacts">
              {contacts.map((e) => (
                <Contact
                  username={e.username}
                  message={e.message}
                  isOffline={e.username.includes("Emily")}
                />
              ))}
            </div>
            <div className="main">
              <TitleBar username={contacts[0].username} />
              <div className="messages">
                {messages.map((e) => (
                  <Message
                    username={e.username}
                    message={e.message}
                    isSelf={e.username === "Bob"}
                  />
                ))}
              </div>
              <div className="edit">
                <textarea className="edit-box" placeholder="Type here" />
                <div className="buttons">
                  <button className="send-btn">Send</button>
                  <span className="tip">Ctrl+Enter to send</span>
                </div>
              </div>
            </div>
          </div>
          <div className="status">
            <span>
              {user.emoji} {user.name}
            </span>
            <div className="connection-status">
              <span
                className={clsx("dot", { connected: conn?.connected })}
              ></span>
              <span>{conn?.connected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
