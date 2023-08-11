import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon, Typography
} from '@mui/material';
import { Search as SearchIcon } from '../../icons/search';
import { Upload as UploadIcon } from '../../icons/upload';
import { Download as DownloadIcon } from '../../icons/download';
import usePlayerStore from '../../contexts/player-context';
import { useEffect } from 'react';
import { Save } from '@mui/icons-material';

export const CustomerListToolbar = (props) => {

  const { auth_token } = props

  const { players, usedPlayers, fetchPlayers, pendingServerPlayerUpdates } = usePlayerStore()

  useEffect(() => {
    const _fetchPlayers = async () => {
      await fetchPlayers(auth_token)
    }
    _fetchPlayers()
  }, [auth_token, fetchPlayers])

  const saveChanges = () => {
    if (pendingServerPlayerUpdates.length === 0) {
      return window.alert('No changes to save')
    }

    pendingServerPlayerUpdates.forEach(async ({ serverId, playerAmount }) => {
      console.log(playerAmount)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/setPlayers?auth_token=${auth_token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serverId,
          playerAmount: parseInt(playerAmount)
        })
      }).catch(err => {
        console.log(err)
      })

      const { message } = await response.json()

      if (!response.ok) {
        window.alert(`Error: ${message} for server ${serverId}`)
      }

      console.log(message)
    })
  }
    

  return (<Box {...props}>
    <Box
      sx={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        m: -1
      }}
    >
      <Typography
        sx={{ m: 1 }}
        variant="h4"
      >
        Available Players: {players.length - usedPlayers}
        
      </Typography>
      <Box sx={{ m: 1 }}>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            mr: 1
          }}
          onClick={saveChanges}
        >
          <Save />
        </Button>
        <Button
          color="primary"
          variant="contained"
        >
          Add Server
        </Button>
      </Box>
    </Box>

  </Box>)
};
