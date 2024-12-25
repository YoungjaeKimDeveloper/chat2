import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  console.log(authUser);
  return (
    <div>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default HomePage;
