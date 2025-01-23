import React, { useEffect, useRef, useState } from "react";
import "./ChatWidget.css";
import {
  getMotivationalQuote,
  getOverdueTasks,
  getPriorityBasedNextTask,
} from "../../shared/Services/Todo/todo-service";

export const ChatWidget = ({ onClose, todos }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const aiMsgListRef = useRef(null);

  useEffect(() => {
    if (aiMsgListRef.current) {
      aiMsgListRef.current.scrollTop = aiMsgListRef.current.scrollHeight;
    }
  }, [messages]);

  const options = [
    "Any overdue tasks? 🕛",
    "Next task based on priority 🚀",
    "Motivate me⚡",
  ];

  const resetLoader = () => {
    setTimeout(() => {
      setIsLoading(false);
      setIsDisabled(false);
    }, 400);
  };

  const handleOptionClick = async (index) => {
    if (isDisabled) return;
    setIsDisabled(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: options[index], type: "sent" },
    ]);

    setTimeout(() => {
      setIsLoading(true);
    }, 300);
    try {
      var response;
      switch (index) {
        case 0:
          response = await getOverdueTasks(todos);
          break;
        case 1:
          response = await getPriorityBasedNextTask(todos);
          break;
        case 2:
          response = await getMotivationalQuote(todos);
          break;
        default:
          throw new Error("Invalid option selected");
      }

      console.log(response);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, type: "received" },
      ]);

      resetLoader();
    } catch (error) {
      console.error(error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "Something went wrong. Please try again later.",
          type: "received",
        },
      ]);
      resetLoader();
    }
  };

  return (
    <div className="chat-widget">
      <button className="close-btn" onClick={onClose}>
        x
      </button>
      <div className="chat-content" ref={aiMsgListRef}>
        <p className="chat-heading">Ask the Task-Master ✨</p>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div key={index} className={`chat-bubble ${message.type}`}>
              {message.text}
            </div>
          ))}
        </div>
        {isLoading ? (
          <div className="dot-flashing"></div>
        ) : (
          <div className="chat-options">
            {options.map((option, index) => (
              <button
                key={index}
                className={`chat-option ${isDisabled ? "disabled" : ""}`}
                onClick={() => handleOptionClick(index)}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="motivational-line">You can do it!</div>
    </div>
  );
};
