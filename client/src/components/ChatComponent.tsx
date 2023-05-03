import React, { useEffect, useState, useRef } from "react";
import { useAppState } from "../context/AppStateContext.js";
import { SyncLoader } from "react-spinners";
import ProductCard from "./shared/ProductCard";
import { getPersonalityImgUrl } from "../utils/helpers";

interface ChatComponentProps {
  product?: any;
  handleSendMessage?: () => void;
  inputMessage?: string;
  isLoading?: boolean;
  setInputMessage?: (message: string) => void;
  messages?: any[];
  setMessages?: any;
}

export default function ChatComponent({
  product,
  handleSendMessage = () => {},
  inputMessage = "",
  isLoading = false,
  setInputMessage = () => {},
  messages = [
    {
      role: "assistant",
      content: "Hei, jeg heter Drikkekompisen! Hvordan kan jeg hjelpe deg?",
    },
  ],
}: ChatComponentProps) {
  const [recommendationIndex, setRecommendationIndex] = useState(-1);

  const [state] = useAppState();

  const { personality } = state;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
      const index = messages.findIndex((msg) =>
        msg.content.includes(`${product?.name}`)
      );
      setRecommendationIndex(index);
    }
  }, [messages, product]);

  return (
    <>
      <div ref={messagesContainerRef} className="mt-8 flex-1 overflow-y-auto">
        {messages.length > 0 &&
          messages
            .filter((message: { role: string }) => message.role !== "system")
            .map(
              (
                message: { content: string; role: string },
                index: React.Key | null | undefined
              ) => {
                const formattedContent = message.content
                  .split("\n")
                  .map((line: string, i: number) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ));
                return (
                  <React.Fragment key={index}>
                    {index === recommendationIndex &&
                      product &&
                      product !== null && (
                        <div className="m-2 ml-12 flex w-[10rem] justify-start">
                          <ProductCard product={product} />
                        </div>
                      )}
                    <div
                      className={`my-2 flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "assistant" && (
                        <img
                          className="mr-2 h-10 w-10 rounded-full"
                          src={getPersonalityImgUrl(personality)}
                          alt="Drikkekompisen"
                        />
                      )}
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-chat-blue text-white"
                            : "bg-chat-gray text-black"
                        }`}
                      >
                        {formattedContent}
                      </div>
                    </div>
                  </React.Fragment>
                );
              }
            )}

        {isLoading && (
          <div className={`my-2 flex justify-start`}>
            <img
              className="mr-2 h-10 w-10 rounded-full"
              src={getPersonalityImgUrl(personality)}
              alt="Drikkekompisen"
            />
            <div
              className={`max-w-[80%] rounded-lg bg-chat-gray px-4 py-2 text-black`}
            >
              <SyncLoader
                color={"rgb(31, 41,55"}
                loading={isLoading}
                size="8px"
                margin="3px"
                className="flex justify-center"
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto flex justify-between">
        <input
          type="text"
          className="flex-grow rounded-lg border-2 border-gray-300 p-2"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button
          className={`ml-4 rounded-lg bg-chat-blue px-4 py-2 font-bold text-white ${
            inputMessage.trim() === "" ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={handleSendMessage}
          disabled={inputMessage.trim() === ""}
        >
          Send
        </button>
      </div>
    </>
    // {/* </div> */}
  );
}
