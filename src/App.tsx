import React, { useRef, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAHv5cZ2wTR4wHpXYc40D05uHfeZHIcHXA",
  authDomain: "message-d0c57.firebaseapp.com",
  databaseURL: "https://message-d0c57.firebaseio.com",
  projectId: "message-d0c57",
  storageBucket: "message-d0c57.appspot.com",
  messagingSenderId: "598136357255",
  appId: "1:598136357255:web:dd6bd3e3d2dc40c2301322"
});

// define auth and firestore in order to access auth and firestore
const auth = firebase.auth();
const firestore = firebase.firestore();

// inside of the main component we just need to check if the user is signed in
// or not if the user is signed in the show chat room else show the sign in
const App: React.FC = () => {
  // get user from state hook
  const [user] = useAuthState(auth);

  return(
    // conditionally render signin or chat room
    <div>
    <header>
    
    </header>
    <section>
      {user ? <ChatRoom /> : <SignIn />}
    </section>
    </div>
  );
}

const ChatRoom: React.FC = () => {

  // define local vars
  const dummy: React.MutableRefObject<any> = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);
  const [values] = useCollectionData<any>(query, {idField: 'id'});
  const [formValue, setFormValue] = useState("");

  // function to send message
  const sendMessage = async(e: any) => {
    e.perventDefault();

    await messagesRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })

    dummy.current.scrollIntoView({behavior: 'smooth'}) 
    setFormValue("");
  };

  return (
    <div>
      {values && values.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>

      <form onSubmit={sendMessage}>
        <input
          value = {formValue} 
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">Submit</button> 
      </form>
      <SignOut/>
    </div>
  );
};

// props
interface Props {
  key: any,
  message: any 
}

// Chat Message Component
const ChatMessage: React.FC<Props> = (props) => {
  const {text} = props.message;

  return (
    <div>
    <p>{text}</p>
    </div>
  );
};

// Sign In Component
const SignIn: React.FC<{}> = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  return(
    <div>
      <button onClick={signInWithGoogle}>Sign In With Google!</button>
    </div>
  );
}

// Sign Out Component
const SignOut: React.FC<{}> = () => {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>SignOut</button>
  );
}

export default App;
