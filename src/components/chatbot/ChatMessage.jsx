import React from 'react'
import chatbotIcon from '../../assets/images/chatIMG.svg';


const ChatMessage = ({ chat }) => {
    return (
        <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.isError ? "error" : ""}`}>
            {chat.role === "model" && <img src={chatbotIcon} alt="Chatbot" />}
            <p className="message-text">{chat.text}</p>
        </div>
    )
}

export default ChatMessage;