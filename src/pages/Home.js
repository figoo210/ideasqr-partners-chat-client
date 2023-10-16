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
    <Box sx={{ display: "flex", width: "auto%" }}>
      <Box
        height={"100vh"}
        borderRight={3}
        sx={{ padding: "10px 0", textAlign: "center", width: "18%" }}
      >
        <NavBar getPage={getPage} />
      </Box>
      {page !== "" ? (
        <>
          <Chats page={page} />
        </>
      ) : (
        <>
          <Box height={"auto"} sx={{ width: "82%", backgroundColor: "#f0f1f5" }}>
            <Start />
          </Box>
        </>
      )}
    </Box>
  );
}

export default Home;
