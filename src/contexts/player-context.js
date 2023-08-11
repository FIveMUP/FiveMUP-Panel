import { create } from 'zustand'

const usePlayerStore = create((set) => ({
    players: [],
    usedPlayers: 0,
    pendingServerPlayerUpdates: [],
    lastFetched: null,

    setPendingServerPlayerUpdates: (serverId, playerAmount) => {
        const pendingServerPlayerUpdates = usePlayerStore.getState().pendingServerPlayerUpdates
        const index = pendingServerPlayerUpdates.findIndex(pendingServerPlayerUpdate => pendingServerPlayerUpdate.serverId === serverId)
        if (index === -1) {
            pendingServerPlayerUpdates.push({ serverId, playerAmount })
        } else {
            pendingServerPlayerUpdates[index].playerAmount = playerAmount
        }
        set({ pendingServerPlayerUpdates })
    },
    setPlayers: (players) => set({ players }),
    setUsedPlayers: (usedPlayers) => set({ usedPlayers }),
    fetchPlayers: async (auth_token) => {
        try {
            if (!auth_token) {
                return { user: null, error: 'No auth token provided' };
            }

            if (Date.now() - usePlayerStore.getState().lastFetched < 1000 * 60 * 1) {
                const usedPlayers = usePlayerStore.getState().players.filter(player => {
                    return (player?.assignedServer !== 'none')
                }).length

                usePlayerStore.setState({ usedPlayers })

                return { players: usePlayerStore.getState(), error: null };
            }

            console.log("Fetching user players");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/players/retrieve?auth_token=${auth_token}`, {
                method: 'GET',
            }).catch(err => {
                console.log(err)
            })

            const { message, players } = await response.json();

            if (!response.ok) {
                throw new Error(message);
            }

            const usedPlayers = players.filter(player => {
                return (player?.assignedServer !== 'none')
            }).length

            set({ players, usedPlayers, lastFetched: Date.now() });

            return { players, error: null };
        } catch (err) {
            console.error(err);
            return { user: null, error: err.message };
        }
    }
}))

export default usePlayerStore;