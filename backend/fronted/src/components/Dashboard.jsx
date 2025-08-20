import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import DataSource from "./DataSource";
import Chat from "./Chat";
import { getAllChat } from "../http";

// const dummyChats = [
//     {
//         id: 1,
//         userId: 101,
//         fileId: 201,
//         title: "Project Proposal Discussion",
//         summary:
//             "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta totam molestiae sed architecto. Aspernatur aut blanditiis accusamus consequuntur veniam. Nisi. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste, amet consequatur quis ipsa sequi nihil minus dignissimos dicta, illum id vero, nobis ipsam ex. Repudiandae atque adipisci omnis libero veniam officia a voluptatum amet quibusdam non placeat praesentium consectetur id necessitatibus provident in, neque blanditiis voluptate temporibus perferendis saepe eos. Quod labore voluptatum corrupti officiis aut eius error recusandae, sit ullam vero sapiente. Distinctio magni harum, eius ullam error minima molestias earum eligendi maxime laboriosam laudantium, obcaecati dolores, suscipit consectetur aperiam rerum nam? Expedita, iusto consequuntur rem aut repellat fugit eos consectetur, eius veritatis provident beatae, non quidem ea eligendi!",
//         createdAt: "2025-08-10T10:00:00Z",
//         updatedAt: "2025-08-10T11:00:00Z",
//     },
//     {
//         id: 2,
//         userId: 101,
//         fileId: 202,
//         title: "Meeting Notes",
//         summary: "Summary of notes taken during weekly team sync.",
//         createdAt: "2025-08-11T09:30:00Z",
//         updatedAt: "2025-08-11T09:45:00Z",
//     },
//     {
//         id: 3,
//         userId: 102,
//         fileId: 203,
//         title: "Research Findings",
//         summary: "Key findings from the market research file.",
//         createdAt: "2025-08-12T14:15:00Z",
//         updatedAt: "2025-08-12T15:00:00Z",
//     },
//     {
//         id: 4,
//         userId: 103,
//         fileId: 204,
//         title: "Bug Fix Conversation",
//         summary: "Discussion on fixing authentication bug in login module.",
//         createdAt: "2025-08-13T08:20:00Z",
//         updatedAt: "2025-08-13T08:50:00Z",
//     },
//     {
//         id: 5,
//         userId: 104,
//         fileId: 205,
//         title: "Design Review",
//         summary: "Feedback on the new UI mockups for dashboard redesign.",
//         createdAt: "2025-08-14T17:00:00Z",
//         updatedAt: "2025-08-14T17:30:00Z",
//     },
// ];

const Dashboard = () => {
    const [chats, setchats] = useState([]);
    const [isAddDataSourceOpen, setIsAddDataSourceOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const res = await getAllChat();
                console.log(res.data);
                setchats(res.data);
                if (res.data.length > 0) {
                    setIsAddDataSourceOpen(false);
                }
                // setchats(dummyChats);
            } catch (error) {
                console.log(error);
            }
        })();
    }, []);

    return (
        <div className="h-screen overflow-hidden w-full bg-[#212121] text-white">
            <Navbar />
            <div className="flex gap-5 h-[90%] px-5">
                <DataSource
                    chats={chats}
                    isAddDataSourceOpen={isAddDataSourceOpen}
                    setIsAddDataSourceOpen={setIsAddDataSourceOpen}
                    setSelectedChat={setSelectedChat}
                    selectedChat={selectedChat}
                    setchats={setchats}
                  
                />
                <Chat
                    selectedChat={selectedChat}
                    setSelectedChat={setSelectedChat}
                    chats={chats}
                    setIsAddDataSourceOpen={setIsAddDataSourceOpen}
                />
            </div>
        </div>
    );
};

export default Dashboard;
