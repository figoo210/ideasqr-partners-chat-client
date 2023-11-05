import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Add } from "@mui/icons-material";
import { Typography } from "@mui/material";
import api from "../services/api";

export function AddNewRoleForm(props) {
  const [records, setRecords] = React.useState([
    {
      role: "",
    },
  ]);

  const handleAddRecord = () => {
    setRecords([...records, { role: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // loop through records array and post each to server
    for (let record of records) {
      api
        .addRole(record)
        .then((r) => {
          props.getNewRoles(r.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }


    console.log("Records saved!");
    setRecords([
      {
        role: "",
      },
    ]);
  };

  const handleChange = (index, event) => {
    const values = [...records];
    values[index][event.target.name] = event.target.value;
    setRecords(values);
  };

  return (
    <Box
      sx={{
        padding: 3,
        textAlign: "center",
        bgcolor: "#ddd",
        mx: 1,
        width: "50%",
      }}
    >
      <Typography variant="h5" my={3}>
        Add New Role
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        {records.map((record, index) => (
          <Box key={index}>
            <TextField
              label="Role"
              name="role"
              value={record.role}
              onChange={(e) => handleChange(index, e)}
              fullWidth
              sx={{ m: 1 }}
              required
            />
          </Box>
        ))}

        <br />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleAddRecord}
            variant="outlined"
            color="success"
            startIcon={<Add />}
            sx={{ mx: 1, flex: 1, py: 2 }}
          >
            Add Role
          </Button>
          <Button
            type="submit"
            color="info"
            variant="contained"
            sx={{ mx: 1, flex: 1, py: 2 }}
          >
            Save Role/s
          </Button>
        </Box>
      </form>
    </Box>
  );
}
