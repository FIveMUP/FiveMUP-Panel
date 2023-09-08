import Head from "next/head";
import { Box, Container, Grid, Pagination, Typography } from "@mui/material";
import { products } from "../__mocks__/products";
import { ProductListToolbar } from "../components/players/product-list-toolbar";
import { PlayerCard } from "../components/players/player-card";
import { DashboardLayout } from "../components/dashboard-layout";
import useAuthStore from "../contexts/auth-context";
import useUserStore from "../contexts/user-context";
import usePlayerStore from "../contexts/player-context";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { PlayerList } from "../components/players/player-list";

const Page = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { fetchUser, servers } = useUserStore();
  const [pendingChanges, setPendingChanges] = useState({});
  const [currentFilter, setCurrentFilter] = useState("");

  useEffect(() => {
    const _fetchUser = async () => {
      if (isAuthenticated) {
        await fetchUser();
      }
    };
    _fetchUser();
  }, [isAuthenticated, fetchUser]);

  const serverQueries = useQueries({
    queries: servers.map((server_id) => ({
      queryKey: ["repoData", server_id],
      queryFn: () =>
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/server/retrieve?server_id=${server_id}&auth_token=${user?.token}`
        ).then((res) => res.json()),
    })),
  });

  useEffect(() => {
    serverQueries.forEach((query) => {
      if (query?.data) {
        const { id, name } = query.data.server;
        console.log("Refreshing server: " + name);
      }
    });
  }, [serverQueries]);

  const isLoading = serverQueries.some((query) => query.isLoading);
  if (isLoading) return "Loading...";

  const firstError = serverQueries.find((query) => query.error);
  if (firstError) return "An error has occurred: " + firstError.error.message;

  if (!isAuthenticated) {
    return <h1>Not Authenticated</h1>;
  } else if (!servers) {
    return <h1>Loading user data...</h1>;
  }

  return (
    <>
      <Head>
        <title>Players | FiveMUP</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false}>
          <ProductListToolbar
            auth_token={user?.token}
            pendingChanges={pendingChanges}
            setPendingChanges={setPendingChanges}
            currentFilter={currentFilter}
            setCurrentFilter={setCurrentFilter}
          />
          <Box sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              <PlayerList auth_token={user?.token} setPendingChanges={setPendingChanges} currentFilter={currentFilter}/>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
