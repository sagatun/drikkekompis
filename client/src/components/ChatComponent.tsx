import React, { useEffect, useRef } from "react";
import { useAppState } from "../context/AppState.context.js";
import { SyncLoader } from "react-spinners";
import { getPersonalityImgUrl } from "../utils/helpers";
import { type Product } from "src/types/index.js";
import { Message } from "./Message";

import { ChatInput } from "./ChatInput.js";

interface ChatComponentProps {
  products?: Product[];
  disabled?: boolean;
  handleSendMessage?: () => void;
  inputMessage?: string;
  isPending?: boolean;
  setInputMessage?: (message: string) => void;
  messages?: any[];
  setMessages?: any;
}

export default function ChatComponent({
  products = [],
  disabled = false,
  handleSendMessage = () => {},
  inputMessage = "",
  isPending = false,
  setInputMessage = () => {},
  messages,
}: ChatComponentProps) {
  const [state] = useAppState();

  const { personality } = state;

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
        className="flex flex-col py-4 overflow-x-hidden overflow-y-auto"
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

        {isPending && (
          <div className={"my-2 flex justify-start"}>
            <img
              className="w-10 h-10 mr-2 rounded-full"
              src={getPersonalityImgUrl(personality)}
              alt="Drikkekompisen"
            />
            <div className={"rounded-lg bg-chat-gray px-4 py-2 text-black"}>
              <SyncLoader
                color={"rgb(31, 41,55"}
                loading={isPending}
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
      />
    </>
  );
}
