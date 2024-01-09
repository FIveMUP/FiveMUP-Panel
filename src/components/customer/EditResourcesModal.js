import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Autocomplete,
  styled,
  Paper,
  ListItemText,
  ListItem,
  List,
  IconButton,
} from "@mui/material";
import moment from "moment";
import "moment-timezone";
import useAuthStore from "../../contexts/auth-context";
import usePlayerStore from "../../contexts/player-context";
import { Stack } from "@mui/system";
import { Close } from "@mui/icons-material";

const style = {
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1.2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  backgroundColor: "background.paper",
}));

const StyledList = styled(List)(({ theme }) => ({
  width: "100%",
  maxWidth: 360,
  backgroundColor: "background.paper",
}));

function CustomListItemText({ item, onDelete }) {
  return (
    <ListItemText
      onClick={onDelete}
      sx={{
        backgroundColor: 'rgba(34,37,48,1.0)',
        p: "0.2rem",
        pl: "0.5rem",
        pr: "0.5rem",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        '&:hover': {
          backgroundColor: 'rgba(255, 0, 0, 0.2)',
          cursor: 'pointer',
          '.deleteIcon': {
            opacity: 1,
          },
        },
      }}
      primary={item}
    />
  );
}


export const EditResourcesModal = ({ open, handleClose, editingServer }) => {
  const { user, isAuthenticated } = useAuthStore();

  const [schedules, setSchedules] = useState([]);
  const [items, setItems] = useState(["Badger_Discord_API",
  "Eagle_Patrol_System",
  "Fox_Inventory_Control",
  "Wolf_Vehicle_Tracker",
  "Panda_EMS_Interface",
  "Hawk_Security_Alert",
  "Otter_Banking_Module",
  "Lynx_Customization_Tool",
  "Dolphin_Traffic_Monitor",
  "Bear_Weather_Effects",
  "Giraffe_Landscaping_Editor",
  "Cobra_Detective_Agency",
  "Raven_Police_Database",
  "Shark_Coastguard_Scanner",
  "Leopard_Racing_League",
  "Falcon_Flight_Simulator",
  "Turtle_Conservation_Project",
  "Jaguar_Jewel_Heist",
  "Owl_Night_Vision",
  "Mongoose_Survival_Game"]);
  const [uploadResourceInput, setUploadResourceInput] = useState("");
  const [time, setTime] = useState("");
  const [players, setPlayers] = useState("");
  const [timezone, setTimezone] = useState(moment.tz.guess());

  const timezones = moment.tz.names(); // Get list of timezones

  const getServerResources = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/server/getServerResources?auth_token=${user.token}&serverId=${editingServer.id}`
    );
    const data = await res.json();
    setItems(data.resources);
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleTimeBlur = () => {
    let formattedTime = formatTime(time);
    setTime(formattedTime);
  };

  const formatTime = (value) => {
    // Validar y formatear el valor a HH:MM
    let parts = value.split(":");
    let hours = parts[0];
    let minutes = parts[1];

    if (hours.length === 1) {
      hours = "0" + hours;
    }

    if (!minutes || minutes.length === 0) {
      minutes = "00";
    } else if (minutes.length === 1) {
      minutes = minutes + "0";
    }

    return `${hours}:${minutes}`;
  };

  useMemo(() => {
    if (editingServer) {
      getServerResources();
    }
  }, [editingServer]);

  const handleAddResource = (uploadResourceInput) => {
    setItems([...items, uploadResourceInput]);
    const newResources = {resources: [...items, uploadResourceInput], serverId: editingServer.id}
  
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/server/setServerResources?auth_token=${user.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResources),
      }
    )
  };

  const handleDeleteResource = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
    const newResources = {resources: newItems, serverId: editingServer.id}
  
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/server/setServerResources?auth_token=${user.token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newResources),
      }
    )
  };

  const timezoneOptions = useMemo(
    () =>
      moment.tz.names().map((tz) => {
        const offset = moment.tz(tz).utcOffset();
        const label = `(UTC${offset >= 0 ? "+" : ""}${Math.floor(offset / 60)}:${(
          "0" +
          (offset % 60)
        ).slice(-2)}) ${tz}`;
        return { value: tz, label };
      }),
    []
  );

  const resources = [
    "cfx-server-data",
    "cfx-server-data-master",
    "cfx-server-data-master",
    "cfx-server-data-master",
    "cfx-server-data-master",
    "africandream",
    "africandream",
    "southern",
    "eastern",
    "london",
    "loopback",
    "outlaw",
  ];

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          ...style,
          bgcolor: "rgba(22,25,35,0.88)",
          width: "52rem",
          borderRadius: "0.6rem",
        }}
      >
        <Typography id="modal-modal-title" 
        variant="h6" 
        component="h2"
        >
          Configure Custom Resources
        </Typography>
        <Typography
          id="modal-modal-description"
          variant="h7"
          component="p"
          sx={{ mt: 1 }}
          color={"#BEBEBE"}
        >
          Leave it blank if you want to use the default resources.
        </Typography>
        {/* Button for add new script with textfield */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            mt: 1,
            mb: 1,
          }}
        >
          <TextField
            id="outlined-basic"
            label="Add new resource"
            variant="outlined"
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                if (uploadResourceInput === "") return;
                setUploadResourceInput("");
                const element = document.getElementById("scroll");
                element.scrollTop = element.scrollHeight;
                handleAddResource(uploadResourceInput)
              }
            }}
            value={uploadResourceInput}
            onChange={(e) => setUploadResourceInput(e.target.value)}
            size="small"
            sx={{ width: "30rem" }}
          />
          <Button
            variant="contained"
            color="success"
            size="small"
            sx={{ ml: 1 }}
            onClick={() => {
              if (uploadResourceInput === "") return;
              const element = document.getElementById("scroll");
              element.scrollTop = element.scrollHeight;
              handleAddResource(uploadResourceInput)
              setUploadResourceInput("");
            }}
          >
            Add
          </Button>
        </Box>
        
        <Paper
          elevation={3}
          id="scroll"
          style={{ maxWidth: '52rem', maxHeight: 300, overflow: "auto", }}
          sx={{
            "&::-webkit-scrollbar": {
              width: "0.4em",
            },

            "&::-webkit-scrollbar-track": {
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
              webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              outline: "1px solid rgba(70,70,70,.6)",
              borderRadius: "0.15em",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,.4)",
              },
            },
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5em" }}>
            {" "}
            {/* Ajusta el espacio según sea necesario */}
            {items.map((item, index) => (
              <ListItem
                key={index}
                style={{ width: "auto", padding: "0px" }}
              >
                <CustomListItemText sx={{ backgroundColor: 'rgba(34,37,48,1.0)', p: "0.2rem", pl: "0.5rem", pr: "0.5rem" }} item={item}
                  onDelete={() => handleDeleteResource(index)}
                />
              </ListItem>
            ))}
          </div>
        </Paper>
      </Box>
    </Modal>
  );
};
