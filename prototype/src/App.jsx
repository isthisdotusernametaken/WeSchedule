import { useState, useEffect, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AgoraRTM from "agora-rtm-sdk";
import { v4 as uuid } from "uuid";

const APP_ID = "67fd1c5e30b04729a87554e28dfc17c0";
const client = AgoraRTM.createInstance(APP_ID);
const CHANNEL_NAME = "wdj";
// Upon loading app, get a unique id for the app.
const uid = uuid();



function App() {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState();
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef();


  useEffect(() => {
    const connect = async () => {
      await client.login({ uid, token: null });
      const channel = await client.createChannel(
        CHANNEL_NAME
      );
      await channel.join();
      channel.on("ChannelMessage", (message, memberId) => {
        setMessages(currentMessages => [
          ...currentMessages,
        {
          uid: memberId,
          text: message.text,
        },
        ]);
      });
      setChannel(channel);
      return channel;
    }; 
    const connection = connect();

    return () => {
      const logout = async () => {
        const channel = await connection;
        await channel.leave();
        await client.logout();
      }
      client.logout();
    }
  }, [])

  useEffect(() => {

    messagesRef.current.scrollTop = 
    messagesRef.current.scrollHeight;
  }, [messages]);
  const sendMessage = (e) => {
    e.preventDefault();
    if (text === "") return;
    channel.sendMessage({
      text,
      type: "text",
    });
    setMessages(currentMessages => [
      ...currentMessages,
    {
      uid,
      text,
    },
    ]);
    setText("");
  };

  return (

    <main>
      <div className="panel">
        <div className="messages" ref={messagesRef}>
          {messages.map((message, index) => (
            <div key={index} className="message"> 
              {message.uid === uid && <div className="user-self">You:&nbsp;</div>}
              {message.uid !== uid && <div className="user-them">Them:&nbsp;</div>}
              <div className="text">{message.text}</div>
            </div>
          ))}
        </div>
      <form onSubmit={sendMessage}>
        <input
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          ></input>
        <button>+</button>
      </form>
      </div>
    </main>
  )
};

export default App
