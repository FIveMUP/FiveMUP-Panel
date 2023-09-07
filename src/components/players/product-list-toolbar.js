import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
} from "@mui/material";
import { Download as DownloadIcon } from "../../icons/download";
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { Save } from "@mui/icons-material";

export const ProductListToolbar = ({ pendingChanges, setPendingChanges, currentFilter, setCurrentFilter, ...rest }) => {

  const handleSaveAll = async () => {
    console.log('Saving all changes');
    if (Object.values(pendingChanges).length === 0) {
      return window.alert('No changes to save')
    }

    for (const { id, name } of Object.values(pendingChanges)) {
      console.log(`Saving ${name} for player ${id}`);
      // try {
      //   console.log(`Saving ${playerAmount} players for server ${serverId}`);
      //   const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/setPlayers?auth_token=${auth_token}`, {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       serverId,
      //       playerAmount: parseInt(playerAmount)
      //     })
      //   });

      //   const { message } = await response.json();

      //   if (!response.ok) {
      //     window.alert(`Error: ${message} for server ${serverId}`);
      //   }

      //   console.log(`Saved ${playerAmount} players for server ${serverId}`);

      //   await new Promise(resolve => setTimeout(resolve, 100));
      // } catch (err) {
      //   console.log(err);
      // }
    }
  }

  return (<Box {...rest}>
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        m: -1,
      }}
    >
      <Typography sx={{ m: 1 }} variant="h4">
        Players
      </Typography>
      <Button
        color="secondary"
        variant="contained"
        sx={{
          mr: 1,
        }}
        onClick={handleSaveAll}
      >
        <Save />
      </Button>
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon fontSize="small" color="action">
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                ),
              }}
              placeholder="Search player"
              value={currentFilter}
              onChange={(event) => setCurrentFilter(event.target.value)}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  </Box>)
};
