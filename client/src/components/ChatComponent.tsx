import React, { useEffect, useRef } from "react";
import { useAppState } from "../context/AppState.context.js";
import { SyncLoader } from "react-spinners";
import { getPersonalityImgUrl } from "../utils/helpers";
import { Product } from "src/types/index.js";
import { Message } from "./Message";
// @ts-ignore
import Redo from "@iconscout/react-unicons/icons/uil-redo";
import { SelectProductsModal } from "./SelectProductsModal.js";
import { ChatInput } from "./ChatInput.js";

interface ChatComponentProps {
  products?: Product[];
  disabled?: boolean;
  handleSendMessage?: () => void;
  inputMessage?: string;
  isLoading?: boolean;
  setInputMessage?: (message: string) => void;
  messages?: any[];
  setMessages?: any;
}

export default function ChatComponent({
  products = [],
  disabled = false,
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

  return (
    <>
      <div
        ref={messagesContainerRef}
        className="flex flex-col overflow-y-auto overflow-x-hidden py-4"
      >
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

      <ChatInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        handleSendMessage={handleSendMessage}
        disabled={disabled}
        selectedProducts={selectedProducts}
      />
    </>
  );
}
