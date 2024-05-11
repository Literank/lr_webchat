import { useEffect, useRef, useState } from "react";
import "./App.css";
import Contact from "./components/contact";
import Message from "./components/message";
import TitleBar from "./components/title-bar";
import LoginForm from "./components/login-form";
import clsx from "clsx";
import io from "socket.io-client";

function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState({ emoji: "", name: "" });
  const [conn, setConn] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [contactMessages, setContactMessages] = useState({});
  const [pickedContact, setPickedContact] = useState(null);
  const [typedContent, setTypedContent] = useState("");
  const [messages, setMessages] = useState([]);
  const resultEndRef = useRef(null);

  useEffect(() => {
    if (!user.name) return;
    const socket = io("http://localhost:4000");
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    socket.on("contacts", (serialUsers) => {
      const users = new Map(serialUsers);
      setContacts([...users.values()].filter((e) => e.sid !== socket.id));
    });
    socket.on("chat", (data) => {
      const { from, msg } = data;
      setMessages((m) => [...m, { name: "", message: msg, isSelf: false }]);
      setContactMessages((m) => {
        return { ...m, [from]: msg };
      });
    });
    socket.emit("user-join", user);
    setConn(socket);
  }, [user]);

  useEffect(() => {
    if (messages.length > 0)
      resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const login = (emoji, name) => {
    setUser({ emoji, name });
    setLogged(true);
  };
  const chat = (toSid, message) => {
    if (!conn) {
      return;
    }
    setMessages((m) => [...m, { name: user.name, message, isSelf: true }]);
    conn.emit("chat", { to: toSid, from: conn.id, msg: message });
    setContactMessages((m) => {
      return { ...m, [toSid]: message };
    });
    setTypedContent("");
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
                  key={e.sid}
                  username={e.emoji + " " + e.name}
                  message={contactMessages[e.sid] || ""}
                  onClick={() => {
                    setPickedContact(e);
                    setMessages([]);
                  }}
                />
              ))}
            </div>
            <div className="main">
              {pickedContact ? (
                <>
                  <TitleBar
                    username={pickedContact.emoji + " " + pickedContact.name}
                  />
                  <div className="messages">
                    {messages.map((e, i) => (
                      <Message
                        key={i}
                        username={e.isSelf ? user.name : pickedContact.name}
                        message={e.message}
                        isSelf={e.isSelf}
                      />
                    ))}
                    <div ref={resultEndRef}></div>
                  </div>
                  <div className="edit">
                    <textarea
                      className="edit-box"
                      placeholder="Type here"
                      value={typedContent}
                      onChange={(e) => setTypedContent(e.target.value)}
                      onKeyUp={(e) => {
                        if (e.ctrlKey && e.key === "Enter") {
                          chat(pickedContact.sid, typedContent);
                        }
                      }}
                    />
                    <div className="buttons">
                      <button
                        className="send-btn"
                        onClick={() => {
                          chat(pickedContact.sid, typedContent);
                        }}
                      >
                        Send
                      </button>
                      <span className="tip">Ctrl+Enter to send</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="brand">Literank</div>
              )}
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
