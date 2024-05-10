import "./App.css";
import Contact from "./components/contact";
import Message from "./components/message";

function App() {
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
  return (
    <div className="app">
      <h1 className="app-name">Literank Web Chat</h1>
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
        <span>🐱 Bob</span>
        <div className="connection-status">
          <span className="dot connected"></span>
          <span>Connected</span>
        </div>
      </div>
    </div>
  );
}

export default App;
