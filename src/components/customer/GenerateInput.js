import { Input } from "@mui/material";
import { useState } from "react";
import usePlayerStore from "../../contexts/player-context";

const GenerateInput = ({ server }) => {
    const [value, setValue] = useState(server.assignedPlayers);
    const { setUsedPlayers, setPendingServerPlayerUpdates, usedPlayers, players } = usePlayerStore()

    const handleChange = (event) => {
        const newValue = parseInt(event.target.value, 10);
        const oldValue = value

        if (newValue < 0) {
            return
        }
        if (isNaN(newValue)) return
        if (newValue > oldValue) {
            if (usedPlayers === players.length) {
                return
            }
            if (usedPlayers + (newValue - oldValue) > players.length) {
                setValue(oldValue + (players.length - usedPlayers))
                setUsedPlayers(players.length)
                setPendingServerPlayerUpdates(server.id, oldValue + (players.length - usedPlayers))
                return
            }
            setUsedPlayers(usedPlayers + (newValue - oldValue))
        } else {
            if (usedPlayers === 0) {
                return
            }
            if (usedPlayers - (oldValue - newValue) < 0) {
                setValue(oldValue - usedPlayers)
                setUsedPlayers(0)
                setPendingServerPlayerUpdates(server.id, oldValue - usedPlayers)
                return
            }
            console.log(oldValue, newValue)
            setUsedPlayers(usedPlayers - (oldValue - newValue))
        }
        setValue(newValue);
        setPendingServerPlayerUpdates(server.id, newValue)
    };

    return (
        <Input
            sx={{
                width: 60,
            }}
            componentsProps={{ min: 0, max: 5 }}
            type='number'
            value={value}
            onChange={handleChange}
        />
    )
}

export { GenerateInput }