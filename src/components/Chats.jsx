import React, { useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from "firebase/firestore";
import { AuthContext } from '../context/AuthContext';
import { db } from '../firebase';
import { ChatContext } from '../context/ChatContext';

const Chats = () => {

  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(()=>{
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
  
      return () => {
        unsub()
      };
    }

    currentUser.uid && getChats();

  }, [currentUser.uid])



  const handleSelect = (user) => {
    dispatch({type: "CHANGE_USER", payload: user})
  }

  const sortedUsers = Object.entries(chats).sort((lastValue, currentValue) => currentValue[1].date - lastValue[1].date)

  return (
    <div className='chats'>
      {sortedUsers.map(chat => ( //sorts chats in sidebar by most recent
        <div className="userChat" key={chat[0]} onClick={()=>handleSelect(chat[1].userInfo)}>
          <img src={chat[1].userInfo.photoURL}/>
            <div className='userChatInfo'>
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
        </div>
      ))}
        
        
    </div>
  )
}

export default Chats;
