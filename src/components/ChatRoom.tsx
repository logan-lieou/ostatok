import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const firestore = firebase.firestore();

firebase.initializeApp({
  apiKey: "AIzaSyAHv5cZ2wTR4wHpXYc40D05uHfeZHIcHXA",
  authDomain: "message-d0c57.firebaseapp.com",
  databaseURL: "https://message-d0c57.firebaseio.com",
  projectId: "message-d0c57",
  storageBucket: "message-d0c57.appspot.com",
  messagingSenderId: "598136357255",
  appId: "1:598136357255:web:dd6bd3e3d2dc40c2301322"
})

const ChatRoom: React.FC = () => {

  // define local vars
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [values] = useCollectionData<any>(query, {idField: 'id'});
  const [formValue, setFormValue] = useState("");

  // function to send message
  const sendMessage = async(e: any) => {
    e.perventDefault();

    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    })

    setFormValue("");
  }

  return (
    <div>
      {values && values.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <form onSubmit={sendMessage}>
        <input
          value = {formValue} 
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Submit</button> 
      </form>
    </div>
  );
}

interface Props {
  key: any,
  message: any 
}

const ChatMessage: React.FC<Props> = (props) => {
    const {text, photoUrl } = props.message.values;
  return (
    <div>
    <img src={photoUrl}/>
    <p>{text}</p>
    </div>
  );
};

export default ChatRoom;
