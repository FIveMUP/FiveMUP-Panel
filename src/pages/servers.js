import Head from 'next/head';
import { Box, Container } from '@mui/material';
import { ServerListResults } from '../components/customer/customer-list-results';
import { CustomerListToolbar } from '../components/customer/customer-list-toolbar';
import { DashboardLayout } from '../components/dashboard-layout';
import { customers } from '../__mocks__/customers';
import { useQuery } from '@tanstack/react-query';
import useAuthStore from '../contexts/auth-context';
import useUserStore from '../contexts/user-context';
import { useEffect } from 'react';
import usePlayerStore from '../contexts/player-context';

const Page = () => {

  const { user, isAuthenticated } = useAuthStore()
  const { fetchUser, servers } = useUserStore()

  useEffect(() => {
    const _fetchUser = async () => {
      if (isAuthenticated) {
        await fetchUser()
      }
    }
    _fetchUser()
  }, [isAuthenticated, fetchUser])


  if (!isAuthenticated) {
    return (<h1>Not Authenticated</h1>)
  } else if (!servers) {
    return (<h1>Loading user data...</h1>)
  }
  
  return (<>
    <Head>
      <title>
        Customers | FiveMUP
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar auth_token={user.token} />
        <Box sx={{ mt: 3 }}>
          <ServerListResults
            servers_id={servers}
            auth_token={user.token}
          />
        </Box>
      </Container>
    </Box>
  </>)
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
