import { Grid } from "@mui/material";
import PlayerCard from "./player-card"; // Asegúrate de que PlayerCard está envuelto en React.memo
import usePlayerStore from "../../contexts/player-context";
import { memo, useEffect, useCallback } from "react";

export const PlayerList = memo(({ auth_token, setPendingChanges, currentFilter }) => {
  const { players, fetchPlayers } = usePlayerStore();

  const memoizedFetchPlayers = useCallback(async () => {
    await fetchPlayers(auth_token);
  }, [auth_token, fetchPlayers]);

  useEffect(() => {
    memoizedFetchPlayers();
  }, [memoizedFetchPlayers]);

  const filtered_player = players.filter((player) => {
    if (currentFilter === "") {
      return true;
    }

    if (player.username.toLowerCase().includes(currentFilter.toLowerCase())) {
      return true;
    }
  });

  return (
    <>
      {filtered_player.map((player) => (
        <Grid item key={player.id} lg={3} md={4} xs={12} sm={6} xl={2}>
          <PlayerCard player={player} setPendingChanges={setPendingChanges} />
        </Grid>
      ))}
    </>
  );
});
