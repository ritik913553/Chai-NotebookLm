import React, { useEffect, useState } from "react";
import { uploadDataSource } from "../http/index.js";
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
}) => {
    const [text, setText] = useState("");
    const [link, setLink] = useState("");
    const [file, setFile] = useState(null);
    const [type, setType] = useState("");
    const [linkOpen, setLinkOpen] = useState("");
    const [loading, setLoading] = useState(false);

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
            setLoading(false);
            setIsAddDataSourceOpen(false);
        } catch (err) {
            console.log(err);
        }
    };
    console.log("Selected Chat:", selectedChat);

    return (
        <div className="w-1/4 shadow-[5px_5px_5px_0px_rgba(0,0,0,0.6)] bg-black h-full rounded-2xl">
            {!isAddDataSourceOpen ? (
                <div className="h-full">
                    <h1 className="px-5 py-2 text-white/60">
                        Your Previous Chats
                    </h1>
                    <hr className="text-gray-500" />
                    <div className="flex justify-between flex-col p-5 h-full pb-20 ">
                        <div className="flex flex-col gap-3 flex-1">
                            {chats.map((chat, index) => (
                                <div
                                    onClick={() => setSelectedChat(chat)}
                                    className={`py-2 px-3 hover:bg-[#212121] cursor-pointer text-white/80 flex gap-x-3 text-sm rounded-xl justify-between ${
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
                                    <span>
                                        <EllipsisVertical size={18} />
                                    </span>
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
                    <div className="p-5 h-full flex flex-col gap-y-5">
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
