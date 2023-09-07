import PropTypes from "prop-types";
import { Avatar, Box, Card, CardContent, Divider, Grid, TextField, Typography } from "@mui/material";
import { Clock as ClockIcon } from "../../icons/clock";
import { Download as DownloadIcon } from "../../icons/download";
import { memo, useState } from "react";

const PlayerCard = ({ player, setPendingChanges, ...rest }) => {
  const [username, setUsername] = useState(player.username);
  const convertDBDate = (dbDate) => {
    const date = new Date(dbDate);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;

    return `${year}-${month}-${day}`;
  };

  const isExpired = (dbDate) => {
    let date = new Date(dbDate);
    return date < Date.now();
  };

  const handleNameChange = (event) => {
    console.log("name change: " + event.target.value);
    setUsername(event.target.value);

    if (event.target.value === player.username) {
      setPendingChanges((prev) => {
        const { [player.id]: _, ...rest } = prev;
        return rest;
      });
      return;
    }

    setPendingChanges((prev) => ({
      ...prev,
      [player.id]: {
        id: player.id,
        name: event.target.value,
      },
    }));
  }

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            pb: 3,
          }}
        >
          <Avatar
            alt="Player"
            src={'/static/images/logo.gif'}
            sx={{
              height: 100,
              width: 100,
            }}
          />
        </Box>
        {/* <Typography align="center" color="textPrimary" gutterBottom variant="h6">
          {player.username}
        </Typography> */}
        <TextField
          fullWidth
          name="name"
          onChange={handleNameChange}
          required
          value={username}
          variant="outlined"
        />
        <Typography align="center" color="textPrimary" variant="body1">
          {player.steam_id}
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} sx={{ justifyContent: "center" }}>
          <Grid
            item
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {
              // check if player is expired
              isExpired(player.expireOn) ? (
                <>
                  <ClockIcon color="error" />
                  <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                    {convertDBDate(player.expireOn)}
                  </Typography>
                </>
              ) : (
                <>
                  <ClockIcon color="success" />
                  <Typography color="textSecondary" display="inline" sx={{ pl: 1 }} variant="body2">
                    {convertDBDate(player.expireOn)}
                  </Typography>
                </>
              )
            }
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

PlayerCard.propTypes = {
  player: PropTypes.object.isRequired,
};

export default memo(PlayerCard);