import { create } from 'zustand'

const useUserStore = create((set) => ({
    id: null,
    username: null,
    servers: [],
    image: null,
    rank: null,
    lastFetched: null,
    skipCache: false,

    skipNextCache: () => set({ skipCache: true }),
    setUsername: (username) => set({ username }),
    setServers: (servers) => set({ servers }),
    delServer: (server_id) => set(state => ({ servers: state.servers.filter(server => server.id !== server_id) })),
    setImage: (image) => set({ image }),
    setRank: (rank) => set({ rank }),
    setId: (id) => set({ id }),
    fetchUser: async (auth_token) => {
        try {

            
            if (!auth_token) {
                return { user: null, error: 'No auth token provided' };
            }

            if (useUserStore.getState().skipCache === false) {
                if (Date.now() - useUserStore.getState().lastFetched < 1000 * 60 * 1) {
                    console.log("Returning cached user");
                    return { user: useUserStore.getState(), error: null };
                }
            } else if (useUserStore.getState().skipCache === true) {
                useUserStore.getState().skipCache = false;
            }

            console.log("Fetching user");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/info?auth_token=${auth_token}`, {
                method: 'GET',
            }).catch(err => {
                console.log(err)
            })

            const { message, user } = await response.json();

            if (!response.ok) {
                throw new Error(message);
            }

            set({
                id: user.id,
                username: user.username,
                servers: user.servers,
                image: user.image,
                rank: user.rank,
                lastFetched: Date.now()
            });

            return { user, error: null };
        } catch (err) {
            console.error(err);
            return { user: null, error: err.message };
        }
    }
}))

export default useUserStore;