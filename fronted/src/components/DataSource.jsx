import React, { useEffect, useState } from "react";
import { deleteChat, getAllChat, uploadDataSource } from "../http/index.js";
import {
    FileText,
    FileSpreadsheet,
    FileType,
    Link,
    Globe,
    Youtube,
    Bot,
    EllipsisVertical,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

const DataSource = ({
    chats,
    isAddDataSourceOpen,
    setIsAddDataSourceOpen,
    setSelectedChat,
    selectedChat,
    setchats,
}) => {
    const [text, setText] = useState("");
    const [link, setLink] = useState("");
    const [file, setFile] = useState(null);
    const [type, setType] = useState("");
    const [linkOpen, setLinkOpen] = useState("");
    const [loading, setLoading] = useState(false);
    const [openChatMenuId, setOpenChatMenuId] = useState(null);
    const [deleteLoaderId, setDeleteLoaderId] = useState(null);

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        console.log("TYPE:", type);
        const data = new FormData();
        if (type === "text") {
            data.append("text", text);
        } else if (type === "url") {
            data.append("url", link);
        } else if (["pdf", "docx", "csv"].includes(type)) {
            data.append("file", file, file.name);
        }
        data.append("type", type);

        try {
            setLoading(true);
            const res = await uploadDataSource(data);
            toast.success("Data Source Uploaded Successfully");
            setSelectedChat(res.data.chat);

            const updatedChats = await getAllChat();
            setchats(updatedChats.data);
            if (chats?.length == 0) {
                setIsAddDataSourceOpen(true);
            }

            setLoading(false);
            setIsAddDataSourceOpen(false);
        } catch (err) {
            setLoading(false);
            toast.error("Failed to Upload Data Source");
            console.log(err);
        }
    };

    const deleteChatHandler = async (id) => {
        try {
            setOpenChatMenuId(null);
            setDeleteLoaderId(id);
            const res = await deleteChat(id);
            toast.success("Chat Deleted Successfully");

            const updatedChats = await getAllChat();
            console.log("Updated Chats:", updatedChats);
            setchats(updatedChats.data);
            setDeleteLoaderId(null);

            if (chats.length == 0) {
                setIsAddDataSourceOpen(true);
            }
        } catch (error) {
            setDeleteLoaderId(null);
            toast.error("Failed to delete chat");
        }
    };
    console.log("Selected Chat:", selectedChat);

    return (
        <div className="w-1/4  shadow-[5px_5px_5px_0px_rgba(0,0,0,0.6)] bg-black h-full rounded-2xl">
            {!isAddDataSourceOpen ? (
                <div className="h-full">
                    <h1 className="px-5 py-2 text-white/60">
                        Your Previous Chats
                    </h1>
                    <hr className="text-gray-500" />
                    <div className="flex justify-between flex-col p-5 h-full pb-20 ">
                        <div className="flex flex-col gap-3 flex-1">
                            {chats?.map((chat, index) => (
                                <div
                                    onClick={() => setSelectedChat(chat)}
                                    className={`relative py-2 px-3 hover:bg-[#212121] cursor-pointer text-white/80 flex gap-x-3 text-sm rounded-xl justify-between ${
                                        selectedChat?._id === chat._id
                                            ? "bg-[#212121]"
                                            : ""
                                    } `}
                                    key={index}
                                >
                                    <div className="flex items-start gap-2">
                                        <Bot size={18} />
                                        <p>{chat.title}</p>
                                    </div>

                                    <span
                                        className={`${
                                            chat._id == deleteLoaderId
                                                ? "hidden"
                                                : "block"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenChatMenuId(
                                                openChatMenuId === chat._id
                                                    ? null
                                                    : chat._id // toggle
                                            );
                                        }}
                                    >
                                        <EllipsisVertical size={18} />
                                    </span>

                                    {deleteLoaderId === chat._id && (
                                        <button
                                            type="button"
                                            className="relative i"
                                            disabled
                                        >
                                            <span className="relative  py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                                <svg
                                                    className="animate-spin -mt-5 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    />
                                                </svg>
                                            </span>
                                        </button>
                                    )}

                                    {/* Dropdown */}
                                    {openChatMenuId === chat._id && (
                                        <div className="absolute right-0 mt-7 w-48 border-black bg-[#212121] rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.8)] border px-5 py-7 z-50">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteChatHandler(chat._id);
                                                    // setOpenChatMenuId(null);
                                                }}
                                                className="mt-7 w-full cursor-pointer bg-red-500 text-white py-1 rounded-md hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setIsAddDataSourceOpen(true)}
                            className="px-5 py-2 rounded-xl cursor-pointer bg-[#212121] hover:bg-[#212121]/70 transform duration-75 text-white/80"
                        >
                            Initiate new Chat By Add Data Source{" "}
                        </button>
                    </div>
                </div>
            ) : loading ? (
                <h1>Loading</h1>
            ) : (
                <div className="h-full">
                    <div className="px-5 py-2 text-white/60 flex items-center justify-between">
                        <h1 className=" ">Add Any One Data Source</h1>
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                setIsAddDataSourceOpen(false);
                            }}
                        >
                            <X />
                        </span>
                    </div>
                    <hr className="text-gray-500" />
                    <div className=" chat-scrollbar  p-5 h-[90%] overflow-auto flex flex-col gap-y-5">
                        <div className=" custom-scrollbar border border-gray-700  h-[40%] w-full bg-[#212121] rounded-xl">
                            <textarea
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    setType("text");
                                }}
                                disabled={file !== null || link !== ""}
                                style={{
                                    cursor:
                                        file !== null || link !== ""
                                            ? "not-allowed"
                                            : "text",
                                }}
                                className="h-full w-full bg-transparent outline-none p-5 text-center resize-none text-white disabled:"
                                placeholder="Write your text here"
                            />
                        </div>
                        <div
                            className="bg-[#212121] border border-gray-700 rounded-xl p-4 "
                            style={{
                                cursor:
                                    text !== "" || link !== ""
                                        ? "not-allowed"
                                        : "text",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3 text-gray-200 font-medium">
                                <FileType size={18} />
                                <span>File Upload</span>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <label
                                    style={{
                                        cursor:
                                            file !== null ||
                                            link !== "" ||
                                            text !== ""
                                                ? "not-allowed"
                                                : "text",
                                    }}
                                    className={`bg-black/50 cursor-pointer px-3 py-1 rounded-md text-sm text-white/70 flex items-center gap-2 hover:bg-black/70 ${
                                        file?.type === "application/pdf"
                                            ? "border-2 border-green-500 rounded-full"
                                            : ""
                                    }`}
                                    disabled={
                                        file !== null ||
                                        text !== "" ||
                                        link !== ""
                                    }
                                >
                                    <FileText size={14} />
                                    PDF
                                    <input
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            setType("pdf");
                                        }}
                                        type="file"
                                        accept=".pdf"
                                        className="hidden"
                                        disabled={
                                            file !== null ||
                                            text !== "" ||
                                            link !== ""
                                        }
                                    />
                                </label>
                                <label
                                    style={{
                                        cursor:
                                            file !== null ||
                                            link !== "" ||
                                            text !== ""
                                                ? "not-allowed"
                                                : "text",
                                    }}
                                    className={`bg-black/50 px-3 cursor-pointer py-1 rounded-md text-sm text-white/70 flex items-center gap-2 hover:bg-black/70 ${
                                        file?.type ===
                                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            ? "border-2 border-green-500 rounded-full"
                                            : ""
                                    }`}
                                    disabled={
                                        file !== null ||
                                        text !== "" ||
                                        link !== ""
                                    }
                                >
                                    <FileType size={14} />
                                    DOCX
                                    <input
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            setType("docx");
                                        }}
                                        type="file"
                                        accept=".docx"
                                        className="hidden"
                                        disabled={
                                            file !== null ||
                                            text !== "" ||
                                            link !== ""
                                        }
                                    />
                                </label>
                                <label
                                    style={{
                                        cursor:
                                            file !== null ||
                                            link !== "" ||
                                            text !== ""
                                                ? "not-allowed"
                                                : "text",
                                    }}
                                    className={`bg-black/50 px-3 cursor-pointer py-1 rounded-md text-sm text-white/70 flex items-center gap-2 hover:bg-black/70 ${
                                        file?.type === "text/csv"
                                            ? "border-2 border-green-500 rounded-full"
                                            : ""
                                    }`}
                                    disabled={
                                        file !== null ||
                                        text !== "" ||
                                        link !== ""
                                    }
                                >
                                    <FileSpreadsheet size={14} />
                                    CSV
                                    <input
                                        onChange={(e) => {
                                            setFile(e.target.files[0]);
                                            setType("csv");
                                        }}
                                        type="file"
                                        accept=".csv"
                                        className="hidden"
                                        disabled={
                                            file !== null ||
                                            text !== "" ||
                                            link !== ""
                                        }
                                    />
                                </label>
                            </div>
                        </div>
                        <div
                            className="bg-[#212121] border border-gray-700 rounded-xl p-4 "
                            style={{
                                cursor:
                                    file !== null || text !== ""
                                        ? "not-allowed"
                                        : "text",
                            }}
                        >
                            <div className="flex items-center gap-2 mb-3 text-gray-200 font-medium">
                                <Link size={18} />
                                <span>Link</span>
                            </div>
                            <div className="flex gap-3 flex-wrap">
                                <button
                                    style={{
                                        cursor:
                                            file !== null ||
                                            link !== "" ||
                                            text !== ""
                                                ? "not-allowed"
                                                : "text",
                                    }}
                                    className={`bg-black/50 px-3 py-1 rounded-md text-sm text-white/70 flex items-center gap-2 hover:bg-black/70 cursor-pointer ${
                                        linkOpen === "website" && link
                                            ? "border-2 border-green-500 rounded-full"
                                            : ""
                                    } `}
                                    onClick={() => setLinkOpen("website")}
                                    disabled={
                                        file !== null ||
                                        text !== "" ||
                                        link !== ""
                                    }
                                >
                                    <Globe size={14} /> Website
                                    {linkOpen === "website" && (
                                        <input
                                            onChange={(e) => {
                                                setLink(e.target.value);
                                                setType("url");
                                            }}
                                            type="url"
                                            value={link}
                                            placeholder="Enter website link"
                                            className="ml-2 bg-transparent outline-none text-white/70"
                                        />
                                    )}
                                </button>
                                <button
                                    style={{
                                        cursor:
                                            file !== null ||
                                            link !== "" ||
                                            text !== ""
                                                ? "not-allowed"
                                                : "text",
                                    }}
                                    className={`bg-black/50 px-3 py-1 rounded-md text-sm text-white/70 flex items-center gap-2 hover:bg-black/70 cursor-pointer ${
                                        file !== null ||
                                        text !== "" ||
                                        link !== ""
                                            ? "cursor-not-allowed"
                                            : ""
                                    } ${
                                        linkOpen === "youtube" && link
                                            ? "border-2 border-green-500 rounded-full"
                                            : ""
                                    } `}
                                    onClick={() => setLinkOpen("youtube")}
                                    disabled={
                                        file !== null ||
                                        text !== "" ||
                                        link !== ""
                                    }
                                >
                                    <Youtube size={14} /> YouTube
                                    {linkOpen === "youtube" && (
                                        <input
                                            onChange={(e) => {
                                                setLink(e.target.value);
                                                setType("url");
                                            }}
                                            type="url"
                                            value={link}
                                            placeholder="Enter YouTube link"
                                            className="ml-2 bg-transparent outline-none text-white/70"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            onClick={formSubmitHandler}
                            className="bg-[#212121] cursor-pointer border border-gray-700 rounded-lg py-2 w-[60%] hover:bg-black/70"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataSource;
