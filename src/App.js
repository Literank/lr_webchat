import "./App.css";
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
  return (
    <div className="app">
      <h1 className="app-name">Literank Web Chat</h1>
      <div className="segments">
        <span className="segment left-seg picked">Chat</span>
        <span className="segment right-seg">Groups</span>
      </div>
      <div className="card">
        <div className="contacts"></div>
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
        <span className="dot connected"></span>
        <span>Connected</span>
      </div>
    </div>
  );
}

export default App;
