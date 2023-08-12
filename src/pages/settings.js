import Head from 'next/head';
import { Box, Container, Typography } from '@mui/material';
import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsNotifications } from '../components/settings/settings-notifications';
import { SettingsPassword } from '../components/settings/settings-password';

import { AuthContext, useAuthContext } from '../contexts/auth-context';

const Page = () => {

  return (<>
    <Head>
      <title>
        Settings | FiveMUP
      </title>
    </Head>
    <Box
      sx={{
        position: 'absolute',
        backgroundColor: 'rgba(22,25,35,0.9)',
        backdropFilter: 'blur(20px)',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        minHeight: '100px',
        height: '100%',
        width: '100%',
        top: 0,
        zIndex: 99
      }}
    >
      <Typography
        color="white"
        variant="h4"
      >
        🚧 Under construction 🚧
      </Typography>
    </Box>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="lg">
        <Typography
          sx={{ mb: 3 }}
          variant="h4"
        >
          Settings
        </Typography>
        <Box sx={{ pt: 3 }}>
          <SettingsPassword />
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
