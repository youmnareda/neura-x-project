import React, { useRef } from "react";
import sendIcon from '../../assets/images/sendIcon.svg'


const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        // Update chat history with user's message
        setChatHistory(history => [...history, { role: "user", text: userMessage }]);


        setTimeout(() => {
            // Add a "Thinking..." placeholder for bot's respond
            setChatHistory(history => [...history, { role: "model", text: "Thinking..." }]);

            // Call the function to generate the bot's response
            generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
        }, 600);


    };

    return (
        <form action="#" className="chat-form" onSubmit={handleFormSubmit}>
            <input ref={inputRef} type="text" placeholder='Type your message ...'
                className='message-input' required />
            <button type="submit">
                <img src={sendIcon} alt="Send" />
            </button>
        </form>
    );
};

export default ChatForm;