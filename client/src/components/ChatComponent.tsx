import React, { useEffect, useRef } from "react";
import { useAppState } from "../context/AppState.context.js";
import { SyncLoader } from "react-spinners";
import { getPersonalityImgUrl } from "../utils/helpers";
import { Product } from "src/types/index.js";
import { Message } from "./Message";
// @ts-ignore
import Redo from "@iconscout/react-unicons/icons/uil-redo";
import { SelectProductsModal } from "./SelectProductsModal.js";

interface ChatComponentProps {
  products?: Product[];
  handleSendMessage?: () => void;
  inputMessage?: string;
  isLoading?: boolean;
  setInputMessage?: (message: string) => void;
  messages?: any[];
  setMessages?: any;
}

export default function ChatComponent({
  products = [],
  handleSendMessage = () => {},
  inputMessage = "",
  isLoading = false,
  setInputMessage = () => {},
  messages,
}: ChatComponentProps) {
  const [state] = useAppState();

  const { personality, selectedProducts } = state;

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (messagesEndRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }

  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  function getSelectProductsStyle() {
    return inputMessage.length > 0
      ? {
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: "none",
        }
      : {
          opacity: 1,
          transition: "opacity 0.3s ease-in-out",
          pointerEvents: "all",
        };
  }

  return (
    <>
      <div ref={messagesContainerRef} className="overflow-y-auto">
        {messages &&
          messages.length > 0 &&
          messages
            .filter((message: { role: string }) => message.role !== "system")
            .map(
              (message: { content: string; role: string }, index: number) => (
                <Message
                  key={index}
                  message={message}
                  index={index}
                  products={products}
                />
              )
            )}

        {isLoading && (
          <div className={`my-2 flex justify-start`}>
            <img
              className="mr-2 h-10 w-10 rounded-full"
              src={getPersonalityImgUrl(personality)}
              alt="Drikkekompisen"
            />
            <div className={`rounded-lg bg-chat-gray px-4 py-2 text-black`}>
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

      <div className="flex justify-between py-4">
        <div className="relative flex flex-grow">
          <SelectProductsModal
            style={getSelectProductsStyle()}
            value={selectedProducts.length}
          />
          <input
            type="text"
            className="flex flex-grow rounded-lg border-2 border-gray-300 p-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            style={{
              transition: "margin 0.3s ease-in-out",
              marginLeft: inputMessage.length > 0 ? "-2rem" : "1rem",
            }}
          />
        </div>

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
  );
}
