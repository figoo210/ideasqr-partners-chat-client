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


function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelectChip(props) {
  const [usersData, setUsersData] = React.useState(null);
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
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
            usersData.map((user, idx) => (
              <MenuItem
                key={idx}
                value={user.id}
                style={getStyles(user, personName, theme)}
              >
                {user.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
}
