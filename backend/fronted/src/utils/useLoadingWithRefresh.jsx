import axios from "axios";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const useLoadingWithRefresh = () => {
  const navigate = useNavigate();
  const {loginUser}=useAuth();

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await axios.get("/api/v1/auth/me", {
          withCredentials: true,
        });
        loginUser(response.data);
        navigate("/");
      } catch (error) {
        console.error(error);
        navigate('/login');
      } finally {
      }
    };
    fetchMe();
  }, []);

  return ;
};