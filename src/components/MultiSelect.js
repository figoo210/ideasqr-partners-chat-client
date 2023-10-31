import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import api from "../services/api";
import { AuthContext } from "../services/AuthContext";


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props) {
  const { user } = React.useContext(AuthContext);
  const [usersData, setUsersData] = React.useState(null);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    console.log(value);
    let v = typeof value === "string" ? value.split(",") : value;
    props.getMembers(v);
    setPersonName(v);
  };

  React.useEffect(() => {
    api.getUsers().then((response) => {
      setUsersData(response.data);
    });
  }, []);

  return (
    <div>
      <FormControl sx={{ flex: 1, mx: 1, width: 300, mt: 2 }}>
        <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {usersData &&
            usersData.map((u, idx) => {
              if (u.id !== user.data.id) {
                return (
                  <MenuItem
                    key={idx}
                    value={u.id}
                    style={getStyles(u, personName, theme)}
                  >
                    {u.name}
                  </MenuItem>
                )
              } else {
                return (
                  <span key={idx}></span>
                )
              }
            }
            )}
        </Select>
      </FormControl>
    </div>
  );
}
