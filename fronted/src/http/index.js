import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1",

    withCredentials: true,
});

export const login = async (data) => await api.post("/auth/login", data);

export const logout = async () => await api.post("/auth/logout");

export const register = async (data) => await api.post("/auth/signup", data);

export const getAllChat = async () => await api.get("/notebook/chats");

export const getAllMessageOfPArticularChat = async (id) =>
    await api.get(`/notebook/chats/messages/${id}`);

export const uploadDataSource = async (data) =>
    await api.post("/notebook/upload", data);


export const sendMessage = async (data) =>
    await api.post("/notebook/upload/chat", data);