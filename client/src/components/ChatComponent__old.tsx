import React, { useEffect, useState } from "react";
//@ts-ignore
import Xicon from "@iconscout/react-unicons/icons/uil-x";
import ProductCard from "./shared/ProductCard";

export default function ChatComponent({
  recommendationFromUserInputHandler,
  recommendedProduct,
  personalRecommendation,
  followupAnswer,
}: any) {
  const [messages, setMessages] = useState([
    {
      text: "Hei! Jeg er Drikkekompis, din ekspert på alkoholhodlige, og alkoholfrie, drikkevarer! Jeg kan anbefale drikke i ditt nærmeste vinmonopol.",
      sender: "chatGPT",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() !== "") {
      setMessages([...messages, { text: inputMessage, sender: "user" }]);
      setInputMessage("");
      recommendationFromUserInputHandler(inputMessage);
    }
  };

  useEffect(() => {
    console.log("recommendedProduct", recommendedProduct);
  }, [recommendedProduct]);

  useEffect(() => {
    if (!Boolean(personalRecommendation)) return;
    if (
      messages
        .map((message) => message.text)
        .includes(personalRecommendation?.recommendation)
    )
      return;
    console.log("tell hvor mange ganger");

    setMessages([
      ...messages,
      {
        text: personalRecommendation?.recommendation,
        sender: "chatGPT",
        isRecommendation: true,
        product: recommendedProduct,
      },
    ]);
  }, [personalRecommendation]);

  useEffect(() => {
    if (!Boolean(followupAnswer)) return;
    if (messages.map((message) => message.text).includes(followupAnswer))
      return;
    setMessages([...messages, { text: followupAnswer, sender: "chatGPT" }]);
  }, [followupAnswer]);

  const handleResetChat = () => {
    setMessages([
      {
        text: "Hei! Jeg er Drikkekompis, din ekspert på alkoholhodlige, og alkoholfrie, drikkevarer! Jeg kan anbefale drikke i ditt nærmeste vinmonopol.",
        sender: "chatGPT",
      },
    ]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-gray-100 flex justify-center items-start">
        <div className="bg-white dark:bg-gray-800 w-full h-1/2  shadow-md p-4 flex flex-col">
          <div className="flex justify-end mb-2">
            <button
              className="text-gray-600 dark:text-gray-300"
              onClick={handleResetChat}
            >
              <Xicon />
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            {messages.map((message, index) => {
              console.log(message);
              if (
                message.isRecommendation &&
                recommendedProduct &&
                personalRecommendation
              ) {
                return (
                  <div
                    key={index}
                    className={`flex my-2 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-chat-blue text-white"
                          : "bg-chat-gray text-black"
                      }`}
                    >
                      <ProductCard product={recommendedProduct} />
                      {message.text}
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    key={index}
                    className={`flex my-2 ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "user"
                          ? "bg-chat-blue text-white"
                          : "bg-chat-gray text-black"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                );
              }
            })}
          </div>
          <div className="flex mt-4">
            <input
              autoFocus
              type="text"
              className="flex-grow border-2 border-gray-300 rounded-lg p-2"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className={`ml-4 bg-chat-blue text-white font-bold py-2 px-4 rounded-lg ${
                inputMessage.trim() === ""
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ""}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
