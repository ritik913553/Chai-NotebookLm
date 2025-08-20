import { Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { getAChat, getAllMessageOfPArticularChat, sendMessage } from "../http";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import ChatLoader from "./ChatLoader";
const Chat = ({
    chats,
    selectedChat,
    setSelectedChat,
    setIsAddDataSourceOpen,
}) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const { user } = useAuth();
    const messagesRef = useRef(null);
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                if (selectedChat) {
                    const res = await getAllMessageOfPArticularChat(
                        selectedChat._id
                    );
                    setMessages(res.data);
                    toast.success("Messages loaded successfully");
                    setLoading(false);
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [selectedChat]);

    useEffect(() => {
        if (messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            messagesRef.current.scrollBehavior = "smooth";
        }
    }, [messages]);
    const handleSendMessage = async (e, customMessage) => {
        e.preventDefault();
        const finalMessage = customMessage || messageContent;
        if (!finalMessage.trim()) {
            toast.error("Message cannot be empty");
            return;
        }
        setMessages((prev) => [
            ...prev,
            { content: finalMessage, sender: "user", createdAt: new Date() },
        ]);
        try {
            setChatLoading(true);
            const res = await sendMessage({
                chatId: selectedChat._id,
                content: finalMessage,
            });
            console.log(res.data);
            setMessages((prev) =>
                prev.map((message, index) => {
                    if (index === prev.length - 1) {
                        return res.data.userMessage;
                    }
                    return message;
                })
            );
            setMessages((prev) => [...prev, res.data.assistantMessage]);

            const updatedChat = await getAChat(selectedChat._id);
            setSelectedChat(updatedChat.data);

            setChatLoading(false);
            setMessageContent("");
        } catch (error) {
            setChatLoading(false);
            console.log(error);
        }
    };


    return (
        <div className="w-3/4 shadow-[0px_5px_5px_0px_rgba(0,0,0,0.6)] bg-black h-full overflow-hidden rounded-2xl">
            {chats?.length > 0 ? (
                selectedChat ? (
                    <div className="h-full flex flex-col ">
                        <div className="h-12 bg-black text-white/60">
                            <h1 className=" px-5 py-2">{selectedChat.title}</h1>
                            <hr />
                        </div>
                        <div
                            ref={messagesRef}
                            className="chat-scrollbar flex-1 overflow-y-auto p-5  "
                        >
                            {/* Summary */}
                            <div className="flex items-center mb-10 ">
                                <div className="bg-transparent mt-10 p-5 w-1/2 border border-white/20 rounded-xl mx-auto">
                                    <h1 className="px-5 text-2xl py-2 text-white/90 text-center mx-auto">
                                        Summary
                                    </h1>
                                    <p className="text-start mt-10 text-sm text-white/60">
                                        {selectedChat.summary}
                                    </p>
                                </div>
                            </div>
                            {messages.map((msg, index) => {
                                const isUser = msg.sender === "user";
                                return (
                                    <div
                                        key={index}
                                        className={`flex w-full mt-5 ${
                                            isUser
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        {/* Avatar for assistant */}
                                        {!isUser && (
                                            <div className="flex-shrink-0 mr-2">
                                                <div className="h-8 w-8 rounded-full bg-[#673AB7] flex items-center justify-center text-sm font-bold">
                                                    🤖
                                                </div>
                                            </div>
                                        )}

                                        {/* Message bubble */}
                                        <div className="flex flex-col max-w-[70%]">
                                            <div
                                                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2  rounded-2xl text-sm shadow-[0px_15px_5px_0px_rgba(0,0,0,0.6)] ${
                                                    isUser
                                                        ? "bg-gray-700 text-white rounded-br-none"
                                                        : "bg-[#2C2C2C] text-gray-100 rounded-bl-none"
                                                }`}
                                            >
                                                <p>{msg.content}</p>
                                            </div>
                                            <span className="block text-[10px] text-gray-400 mt-1 text-right">
                                                {format(
                                                    new Date(msg.createdAt),
                                                    "hh:mm a"
                                                )}
                                            </span>
                                        </div>
                                        {/* Avatar for user */}
                                        {isUser && (
                                            <div className="flex-shrink-0 ml-2">
                                                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-sm font-bold">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            {chatLoading && <ChatLoader />}
                        </div>
                        <div className="p-5">
                            <div className="h-24 bg-transparent border border-white/20 rounded-xl ">
                                <div className="flex  items-center justify-between px-5">
                                    <input
                                        type="text"
                                        value={messageContent}
                                        onChange={(e) =>
                                            setMessageContent(e.target.value)
                                        }
                                        className="w-full px-5 py-2 rounded-xl outline-none  text-white/80"
                                        placeholder="Type your message"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        className="text-white/70 cursor-pointer"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                                <div className="flex items-center overflow-auto gap-x-5 px-5 mt-2">
                                    {selectedChat.similarQuestions &&
                                        selectedChat.similarQuestions.length >
                                            0 &&
                                        selectedChat.similarQuestions.map(
                                            (question, index) => (
                                                <div>
                                                    <p
                                                        key={index}
                                                        className="text-xs border-1 px-2 py-1 rounded-lg border-white/20 text-white/60 cursor-pointer hover:text-white/80 hover:scale-102 transform duration-120"
                                                        onClick={(e) => handleSendMessage(e, question)}
                                                    >
                                                        {question}
                                                    </p>
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                        <h1 className="text-xl text-white/70">
                            Select a Chat for start the Conversation
                        </h1>
                    </div>
                )
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-white">
                    <h1 className="text-xl">Add Data Source to Start chat</h1>
                    <button
                        onClick={() => setIsAddDataSourceOpen(true)}
                        className="px-3 py-1 mt-5 rounded-lg text-sm hover:scale-110 transform duration-100 bg-[#212121] cursor-pointer hover:bg-[#212121]/70  text-white/80"
                    >
                        Upload Resources
                    </button>
                </div>
            )}
        </div>
    );
};

export default Chat;
