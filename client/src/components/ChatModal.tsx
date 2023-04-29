import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import ChatComponent from "./ChatComponent";
import { useMutation } from "@tanstack/react-query";
import { chatGPTConversation } from "../api/chatGPT";

export default function ChatModal({
  isOpen,
  onRequestClose,
  systemPrompt,
  product,
}: // conversationHandler,
// conversationHistory,
any) {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([
    systemPrompt,
    {
      role: "assistant",
      content: `Hei kompis! Jeg er Drikkekompis🍻, din personlige guide og ekspert på både alkoholholdige og alkoholfrie drikkevarer! 

La oss starte en samtale og jeg vil dele min kunnskap og innsikt med deg for å hjelpe deg med å finne den perfekte drikken for enhver anledning.`,
    },
  ]);

  const chatGPTMutation = useMutation(chatGPTConversation, {
    onSuccess: (response) => {
      handleChatGPTResponse(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    Modal.setAppElement("body");
  });

  function handleChatGPTResponse(response: any) {
    setMessages(response.conversationHistory);
  }

  const handleSendMessage = () => {
    const updatedMessages = [
      ...messages,
      { content: inputMessage, role: "user" },
    ];
    setInputMessage("");
    setMessages(updatedMessages);
    const packageForChatGPT = { conversationHistory: updatedMessages };
    chatGPTMutation.mutate(packageForChatGPT);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed mx-auto h-full w-full max-w-2xl  overflow-hidden rounded-md border-none bg-white shadow-lg"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-30"
    >
      <button
        className={
          "absolute right-4 top-4 rounded bg-gray-400 px-4 py-2 font-bold text-white shadow-md transition duration-200 hover:bg-gray-500"
        }
        onClick={onRequestClose}
      >
        X
      </button>

      <div className="m-auto flex h-full w-full flex-col overflow-y-auto md:flex-row">
        <ChatComponent
          messages={messages}
          product={product}
          handleSendMessage={handleSendMessage}
          isLoading={chatGPTMutation.isLoading}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
        />
      </div>
    </Modal>
  );
}
