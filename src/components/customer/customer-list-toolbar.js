import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Modal,
  Backdrop,
} from "@mui/material";
import usePlayerStore from "../../contexts/player-context";
import { useEffect, useState, forwardRef, cloneElement } from "react";
import { Save } from "@mui/icons-material";
import { useRouter } from "next/router";
import { Fade } from "../fade";
import { AddServerModal } from "./AddServer";
import useUserStore from "../../contexts/user-context";

export const CustomerListToolbar = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [cfxCode, setCfxCode] = useState("");
  const [cfxLicense, setCfxLicense] = useState("");

  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  const { auth_token } = props;
  const router = useRouter();
  const { skipNextCache } = useUserStore();

  const { players, usedPlayers, fetchPlayers, pendingServerPlayerUpdates } = usePlayerStore();

  const downloadLatestArtifacts = async () => {
    window.open('https://drive.usercontent.google.com/download?id=1AVe_ym1Mgtld6D_T7QwDJ60C9hLgS6VY', '_blank');
  };

  useEffect(() => {
    const _fetchPlayers = async () => {
      await fetchPlayers(auth_token);
    };
    _fetchPlayers();
  }, [auth_token, fetchPlayers]);

  const saveChanges = async () => {
    if (pendingServerPlayerUpdates.length === 0) {
      return window.alert("No changes to save");
    }

    for (const { serverId, playerAmount } of pendingServerPlayerUpdates) {
      try {
        console.log(`Saving ${playerAmount} players for server ${serverId}`);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/server/setPlayers?auth_token=${auth_token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              serverId,
              playerAmount: parseInt(playerAmount),
            }),
          }
        );

        const { message } = await response.json();

        if (!response.ok) {
          window.alert(`Error: ${message} for server ${serverId}`);
        }

        console.log(`Saved ${playerAmount} players for server ${serverId}`);

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (err) {
        console.log(err);
      }
    }
    router.reload();
  };

  const createServer = async () => {
    console.log(`Creating server ${name} with cfxCode ${cfxCode} and cfxLicense ${cfxLicense}`);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/create?auth_token=${auth_token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        cfxCode,
        cfxLicense,
      }),
    })
      .then(async (response) => {
        const { message } = await response.json();

        if (!response.ok) {
          window.alert(`Error: ${message}`);
          return;
        }

        skipNextCache();

        console.log(`Created server ${name} with cfxCode ${cfxCode} and cfxLicense ${cfxLicense}`);
        // router.reload()
      })
      .catch((err) => {
        console.log(err);
      });

    handleClose();
    setName("");
    setCfxCode("");
    setCfxLicense("");
  };

  return (
    <Box {...props}>
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          m: -1,
        }}
      >
        <AddServerModal isOpen={isModalOpen} handleClose={handleClose}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add Server
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={cfxCode}
            onChange={(e) => setCfxCode(e.target.value)}
            label="cfxCode"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            value={cfxLicense}
            onChange={(e) => setCfxLicense(e.target.value)}
            label="cfxLicense"
          />
          <Button variant="contained" color="primary" onClick={createServer} sx={{ mt: 2 }}>
            Create Server
          </Button>
        </AddServerModal>
        <Typography sx={{ m: 1 }} variant="h4">
          Available Players: {players.length - usedPlayers}
        </Typography>
        <Box sx={{ m: 1 }}>
          <Button
            color="warning"
            variant="contained"
            sx={{
              mr: 1,
            }}
            onClick={downloadLatestArtifacts}
          >
            Download Latest Artifacts
          </Button>
          <Button
            color="secondary"
            variant="contained"
            sx={{
              mr: 1,
            }}
            onClick={saveChanges}
          >
            <Save />
          </Button>
          <Button color="primary" variant="contained" onClick={handleOpen}>
            Add Server
          </Button>
        </Box>
      </Box>
    </Box>
  );
};
