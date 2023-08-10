import { create } from 'zustand'

const useUserStore = create((set) => ({
    id: '',
    username: '',
    servers: [],
    image: '',
    rank: '',
    setUsername: (username) => set({ username }),
    setServers: (servers) => set({ servers }),
    setImage: (image) => set({ image }),
    setRank: (rank) => set({ rank }),
    setId: (id) => set({ id }),
    fetchUser: async (auth_token) => {
        try {
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
                rank: user.rank
            });

            return { user, error: null };
        } catch (err) {
            console.error(err);
            return { user: null, error: err.message };
        }
    }
}))

export default useUserStore;