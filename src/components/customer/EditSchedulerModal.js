import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Autocomplete } from '@mui/material';
import moment from 'moment';
import 'moment-timezone';
import useAuthStore from '../../contexts/auth-context';
import usePlayerStore from '../../contexts/player-context';

const style = {
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '1.2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const EditSchedulerModal = ({ open, handleClose, editingServer }) => {
  const { user, isAuthenticated } = useAuthStore()


  const [schedules, setSchedules] = useState([]);
  const [time, setTime] = useState('');
  const { players: customerPlayers, usedPlayers, fetchPlayers, pendingServerPlayerUpdates } = usePlayerStore()
  const [players, setPlayers] = useState('');
  const [timezone, setTimezone] = useState(moment.tz.guess());

  const timezones = moment.tz.names(); // Get list of timezones


  useEffect(() => {
    const _fetchPlayers = async () => {
      await fetchPlayers(user.token)
    }
    _fetchPlayers()
  }, [user.token, fetchPlayers])

  const getServerScheduler = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/getServerScheduler?auth_token=${user.token}&serverId=${editingServer.id}`)
    const data = await res.json()
    setSchedules(data.scheduler)
  }

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleTimeBlur = () => {
    let formattedTime = formatTime(time);
    setTime(formattedTime);
  };

  const formatTime = (value) => {
    // Validar y formatear el valor a HH:MM
    let parts = value.split(':');
    let hours = parts[0];
    let minutes = parts[1];

    if (hours.length === 1) {
      hours = '0' + hours;
    }

    if (!minutes || minutes.length === 0) {
      minutes = '00';
    } else if (minutes.length === 1) {
      minutes = minutes + '0';
    }

    return `${hours}:${minutes}`;
  };

  useMemo(() => {
    if (editingServer) {
      getServerScheduler()
    }
  }, [editingServer])

  const handleAddSchedule = () => {
    console.log("XD")
    const newSchedule = { time, players: Number(players), timezone, serverId: editingServer.id };
    if (newSchedule.time && !isNaN(newSchedule.players)) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/setServerScheduler?auth_token=${user.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSchedule),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      setSchedules([...schedules, newSchedule]);
      setTime('');
      setPlayers('');
    }
  };

  const timezoneOptions = useMemo(() => moment.tz.names().map((tz) => {
    const offset = moment.tz(tz).utcOffset();
    const label = `(UTC${offset >= 0 ? '+' : ''}${Math.floor(offset / 60)}:${('0'+(offset % 60)).slice(-2)}) ${tz}`;
    return { value: tz, label };
  }), []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{
        ...style,
        bgcolor: "rgba(22,25,35,0.88)",
        width: '60rem',
        borderRadius: '0.6rem',
      }}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Configure Player Schedules
        </Typography>
        <TextField
          label="Time (HH:MM)"
          value={time}
          onChange={handleTimeChange}
      onBlur={handleTimeBlur}
          margin="normal"
        />
        <TextField
          label="Players"
          type="number"
          value={players}
          onChange={(e) => {
            console.log(customerPlayers)
            if (Number(e.target.value) < 0) return setPlayers(0)
            if (e.target.value.length > 1 && e.target.value[0] === '0') {
              setPlayers(e.target.value.slice(1))
              return
            }          
            if (Number(e.target.value) > customerPlayers.length) {
              setPlayers(customerPlayers.length)
              return
            }
            setPlayers(e.target.value)
          }}
          margin="normal"
        />
        <Autocomplete
          sx={{ marginTop: '1rem' }}
          options={timezoneOptions}
          autoHighlight
          getOptionLabel={(option) => option.label}
          renderOption={(props, option) => (
            <Box component="li" {...props}>
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Choose a timezone"
              inputProps={{
                ...params.inputProps,
                autoComplete: 'new-password',
              }}
            />
          )}
          value={timezoneOptions.find(option => option.value === timezone)}
          onChange={(event, newValue) => {
            setTimezone(newValue ? newValue.value : null);
          }}
          ListboxProps={{
            style: {
              maxHeight: '22rem',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              overflowY: 'scroll',
            }
          }}
          PaperComponent={({ children }) => (
            <Box sx={{ bgcolor: "rgba(22,25,35, 0.96)" }}>
              {children}
            </Box>
          )}
        />
        <Button onClick={handleAddSchedule} variant="contained" sx={{ mt: 2 }}>
          Add Schedule
        </Button>
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Players</TableCell>
              <TableCell>Timezone</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule, index) => (
              <TableRow key={index}>
                <TableCell>{schedule.time}</TableCell>
                <TableCell>{schedule.players}</TableCell>
                <TableCell>{schedule.timezone}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/deleteServerScheduler?auth_token=${user.token}`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          time: schedule.time,
                          players: schedule.players,
                          timezone: schedule.timezone,
                          serverId: editingServer.id,
                        })
                      })
                        .then((response) => response.json())
                        .then((data) => {
                          console.log('Success:', data);
                        })
                        .catch((error) => {
                          console.error('Error:', error);
                        });
                      setSchedules(schedules.filter((_, i) => i !== index));
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};
