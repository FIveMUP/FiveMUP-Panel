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
import { useRouter } from "next/router";

export const ProductListToolbar = ({ auth_token, pendingChanges, setPendingChanges, currentFilter, setCurrentFilter, ...rest }) => {
  const router = useRouter();
  const handleSaveAll = async () => {
    console.log('Saving all changes');
    if (Object.values(pendingChanges).length === 0) {
      return window.alert('No changes to save')
    }

    for (const { id, name } of Object.values(pendingChanges)) {
      console.log(`Saving ${name} for player ${id}`);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/players/setPlayerName?auth_token=${auth_token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            playerId: id,
            playerName: name
          })
        });

        const { message } = await response.json();

        if (!response.ok) {
          window.alert(`Error: ${message} for server ${serverId}`);
        }

        console.log(`Saved ${name} for player ${id} successfully`);

        
        await new Promise(resolve => setTimeout(resolve, 25));
      } catch (err) {
        console.log(err);
      }
    }

    window.alert('All changes saved successfully');
    setPendingChanges({});
    router.reload();
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
