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
      const entry = { name: "", message: msg, isSelf: false };
      setContactMessages((cm) => {
        const oldMessages = cm[from] || [];
        const newMessages = [...oldMessages, entry];
        return { ...cm, [from]: newMessages };
      });
    });
    socket.emit("user-join", user);
    setConn(socket);
  }, [user]);

  useEffect(() => {
    if (!pickedContact) return;
    const messages = contactMessages[pickedContact.sid] || [];
    if (messages.length > 0)
      resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contactMessages, pickedContact]);

  const login = (emoji, name) => {
    setUser({ emoji, name });
    setLogged(true);
  };
  const chat = (toSid, message) => {
    if (!conn || !message.trim()) {
      return;
    }
    const entry = { name: user.name, message, isSelf: true };
    conn.emit("chat", { to: toSid, from: conn.id, msg: message });
    setContactMessages((cm) => {
      const oldMessages = cm[toSid] || [];
      const newMessages = [...oldMessages, entry];
      return { ...cm, [toSid]: newMessages };
    });
    setTypedContent("");
  };
  const lastMessage = (messages) => {
    if (!messages) {
      return "";
    }
    if (messages.length > 0) {
      return messages[messages.length - 1].message;
    }
    return "";
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
                  message={lastMessage(contactMessages[e.sid])}
                  onClick={() => {
                    setPickedContact(e);
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
                    {(contactMessages[pickedContact.sid] || []).map((e, i) => (
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
