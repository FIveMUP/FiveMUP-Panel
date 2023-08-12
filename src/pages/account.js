import Head from 'next/head';
import { Box, Container, Grid, Typography } from '@mui/material';
import { AccountProfile } from '../components/account/account-profile';
import { AccountProfileDetails } from '../components/account/account-profile-details';
import { DashboardLayout } from '../components/dashboard-layout';

const Page = () => (
  <>
    <Head>
      <title>
        Account | FiveMUP
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
          Account
        </Typography>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <AccountProfile />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <AccountProfileDetails />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
