import { useEffect, useRef, useState } from "react";
import "./App.css";
import Contact from "./components/contact";
import Message from "./components/message";
import TitleBar from "./components/title-bar";
import LoginForm from "./components/login-form";
import CreateGroup from "./components/create-group";
import Group from "./components/group";
import clsx from "clsx";
import io from "socket.io-client";

function randomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function App() {
  const [logged, setLogged] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false);
  const [isGroupChatting, setIsGroupChatting] = useState(false);

  const [user, setUser] = useState({ emoji: "", name: "" });
  const [conn, setConn] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contactMessages, setContactMessages] = useState({});
  const [groupMessages, setGroupMessages] = useState({});
  const [contactNotifications, setContactNotifications] = useState({});
  const [groupNotifications, setGroupNotifications] = useState({});
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
      setContactNotifications((cn) => {
        return { ...cn, [from]: true };
      });
    });
    socket.on("create-group", (data) => {
      const { name, id } = data;
      setGroups((gs) => [...gs, { name, id }]);
      setGroupMessages((gm) => {
        return { ...gm, [id]: [] };
      });
    });
    socket.on("group-chat", (data) => {
      const { speaker, msg, room: roomId } = data;
      const entry = { name: speaker, message: msg, isSelf: false };
      setGroupMessages((gm) => {
        const oldMessages = gm[roomId] || [];
        const newMessages = [...oldMessages, entry];
        return { ...gm, [roomId]: newMessages };
      });
      setGroupNotifications((gn) => {
        return { ...gn, [roomId]: true };
      });
    });
    socket.emit("user-join", user);
    setConn(socket);
  }, [user]);

  useEffect(() => {
    if (!pickedContact) return;
    const messages =
      contactMessages[pickedContact.sid] ||
      groupMessages[pickedContact.id] ||
      [];
    if (messages.length > 0)
      resultEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [contactMessages, groupMessages, pickedContact]);

  const login = (emoji, name) => {
    setUser({ emoji, name });
    setLogged(true);
  };
  const chat = (to, message) => {
    if (!conn || !message.trim()) {
      return;
    }
    const fullName = user.emoji + " " + user.name;
    const entry = { name: fullName, message, isSelf: true };
    if (isGroupChatting) {
      const roomId = to;
      conn.emit("group-chat", {
        room: roomId,
        speaker: fullName,
        msg: message,
      });
      setGroupMessages((gm) => {
        const oldMessages = gm[roomId] || [];
        const newMessages = [...oldMessages, entry];
        return { ...gm, [roomId]: newMessages };
      });
    } else {
      conn.emit("chat", { to, from: conn.id, msg: message });
      setContactMessages((cm) => {
        const oldMessages = cm[to] || [];
        const newMessages = [...oldMessages, entry];
        return { ...cm, [to]: newMessages };
      });
    }

    setTypedContent("");
  };
  const createGroup = (userSids, groupName) => {
    if (!conn) {
      return;
    }
    if (!groupName) {
      alert("Group name needed.");
      return;
    }
    if (!userSids || userSids.length < 2) {
      alert("A group takes at least 3 users.");
      return;
    }
    userSids.push(conn.id);
    const roomId = randomString(6);
    conn.emit("create-group", { sids: userSids, name: groupName, id: roomId });
    setCreatingGroup(false);
    setIsGroupChatting(true);
    setPickedContact({ name: groupName, id: roomId });
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
  const readMessage = (id) => {
    if (isGroupChatting) {
      setGroupNotifications((gn) => {
        return { ...gn, [id]: false };
      });
    } else {
      setContactNotifications((cn) => {
        return { ...cn, [id]: false };
      });
    }
  };
  const shouldNotify = () => {
    if (isGroupChatting) {
      // Notify for Chat Tab
      return Object.values(contactNotifications).some((e) => e === true);
    } else {
      // Notify for Groups Tab
      return Object.values(groupNotifications).some((e) => e === true);
    }
  };
  return (
    <>
      <div className="app">
        <h1 className={clsx("app-name", { "center-name": !logged })}>
          Literank Web Chat
        </h1>
        {!logged ? (
          <LoginForm callback={login} />
        ) : (
          <>
            <div className="segments">
              <span
                className={clsx("segment left-seg", {
                  picked: !isGroupChatting,
                })}
                onClick={() => {
                  setIsGroupChatting(false);
                  setPickedContact(null);
                }}
              >
                {isGroupChatting && shouldNotify() && (
                  <span className="notify-dot"></span>
                )}
                Chat
              </span>
              <span
                className={clsx("segment right-seg", {
                  picked: isGroupChatting,
                })}
                onClick={() => {
                  setIsGroupChatting(true);
                  setPickedContact(null);
                }}
              >
                {!isGroupChatting && shouldNotify() && (
                  <span className="notify-dot"></span>
                )}
                Groups
              </span>
            </div>
            <div className="card">
              <div className="contacts">
                {isGroupChatting
                  ? groups.map((e) => (
                      <Group
                        key={e.id}
                        name={e.name}
                        message={lastMessage(groupMessages[e.id])}
                        notify={
                          e.id !== pickedContact?.id && groupNotifications[e.id]
                        }
                        onClick={() => {
                          setPickedContact(e);
                          if (pickedContact) {
                            readMessage(pickedContact.id);
                          }
                          readMessage(e.id);
                        }}
                      />
                    ))
                  : contacts.map((e) => (
                      <Contact
                        key={e.sid}
                        username={e.emoji + " " + e.name}
                        message={lastMessage(contactMessages[e.sid])}
                        notify={
                          e.sid !== pickedContact?.sid &&
                          contactNotifications[e.sid]
                        }
                        onClick={() => {
                          setPickedContact(e);
                          if (pickedContact) {
                            readMessage(pickedContact.sid);
                          }
                          readMessage(e.sid);
                        }}
                      />
                    ))}
              </div>
              <div className="main">
                {pickedContact ? (
                  <>
                    <TitleBar
                      name={
                        isGroupChatting
                          ? pickedContact.name
                          : pickedContact.emoji + " " + pickedContact.name
                      }
                      onClick={() => setCreatingGroup(true)}
                      isGroup={isGroupChatting}
                    />
                    <div className="messages">
                      {isGroupChatting
                        ? (groupMessages[pickedContact.id] || []).map(
                            (e, i) => (
                              <Message
                                key={i}
                                username={e.name}
                                message={e.message}
                                isSelf={e.isSelf}
                              />
                            )
                          )
                        : (contactMessages[pickedContact.sid] || []).map(
                            (e, i) => (
                              <Message
                                key={i}
                                username={
                                  e.isSelf ? user.name : pickedContact.name
                                }
                                message={e.message}
                                isSelf={e.isSelf}
                              />
                            )
                          )}
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
                            chat(
                              isGroupChatting
                                ? pickedContact.id
                                : pickedContact.sid,
                              typedContent
                            );
                          }
                        }}
                      />
                      <div className="buttons">
                        <button
                          className="send-btn"
                          onClick={() => {
                            chat(
                              isGroupChatting
                                ? pickedContact.id
                                : pickedContact.sid,
                              typedContent
                            );
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
      {creatingGroup && (
        <CreateGroup
          contacts={contacts}
          pal={pickedContact}
          callback={createGroup}
          close={() => setCreatingGroup(false)}
        />
      )}
    </>
  );
}

export default App;
