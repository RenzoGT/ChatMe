import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  orderBy,
  query,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { getAuth, signInWithPopup } from "firebase/auth";

import { GoogleAuthProvider } from "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

import { useState, useRef } from "react";

const app = initializeApp({
  apiKey: "AIzaSyDQNnMCbJxrs7aOrpXC6Qa3gI3jzs8IQug",
  authDomain: "chatme-f71c5.firebaseapp.com",
  projectId: "chatme-f71c5",
  storageBucket: "chatme-f71c5.appspot.com",
  messagingSenderId: "580142760682",
  appId: "1:580142760682:web:bcca95b80cb7d35e1e4d93",
  measurementId: "G-SDPV8RGF6T",
});

const auth = getAuth(app);
const firestore = getFirestore(app);

const App = () => {
  console.clear();

  const [user] = useAuthState(auth);
  return (
    <div>
      <header>
        <h1>ChatMe</h1>
        <div>
          {user && <img src={user.photoURL} alt="" />}
          <SignOut />
        </div>
      </header>

      <section>{user ? <ChatRoom user={user} /> : <SignIn />}</section>
    </div>
  );
};

const SignIn = () => {
  const signButton = () => {
    const provider = new GoogleAuthProvider();

    return (
      <div id="login">
        <button onClick={() => signInWithPopup(auth, provider)}>
          <i className="fa-brands fa-google"></i>
          Sign In
        </button>
      </div>
    );
  };

  return signButton();
};

const SignOut = () => {
  return (
    auth.currentUser && <button onClick={() => auth.signOut()}>Sign Out</button>
  );
};

const ChatRoom = (props) => {
  const q = query(collection(firestore, "messages"), orderBy("id"));

  const [value] = useCollectionData(q);

  const [inputText, setInputText] = useState("");

  const ref = useRef(null);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    await addDoc(collection(firestore, "messages"), {
      date: Timestamp.fromDate(new Date()),
      msg: inputText,
      pic: props.user.photoURL,
      uid: props.user.uid,
      id: value.length,
    });

    ref.current?.scrollTo({ top: 1000000, behavior: "smooth" });

    setInputText("");
  };

  const handleTextChange = (evt) => {
    setInputText(evt.target.value);
  };

  return (
    <div id="container">
      <div ref={ref} id="messages">
        {value &&
          value.map((msg) => (
            <ChatMessage
              key={msg.date}
              message={msg.msg}
              pic={msg.pic}
              uid={msg.uid}
              cuser={props.user.uid}
            />
          ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type your msg here..."
          onChange={handleTextChange}
          value={inputText}
          required
          maxLength={1000}
        />
        <button type="submit">
          <i className="fa-regular fa-message"></i>
        </button>
      </form>
    </div>
  );
};

const ChatMessage = (props) => {
  const text = props.message;
  const pic = props.pic;

  return (
    <div className={props.uid == props.cuser ? "sent" : "received"}>
      <div className="box">
        <p>{text}</p>
        <img src={pic} alt="" />
      </div>
    </div>
  );
};

export default App;
