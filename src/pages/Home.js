import React, { useState } from "react";
import { Box } from "@mui/material";
import NavBar from "../components/NavBar";
import Start from "./Start";
import Chats from "./Chats";

function Home() {
  const [page, setPage] = useState("Messages");

  const getPage = (value) => {
    setPage(value);
  };

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Box
        height={"100vh"}
        borderRight={3}
        sx={{ padding: "10px 0", textAlign: "center", width: "17%" }}
      >
        <NavBar getPage={getPage} />
      </Box>
      {page !== "" ? (
        <>
          <Chats page={page} />
        </>
      ) : (
        <>
          <Box height={"100vh"} sx={{ width: "83%", backgroundColor: "#ccc" }}>
            <Start />
          </Box>
        </>
      )}
    </Box>
  );
}

export default Home;
