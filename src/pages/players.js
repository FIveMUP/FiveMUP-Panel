import Head from 'next/head';
import { Box, Container, Grid, Pagination, Typography } from '@mui/material';
import { products } from '../__mocks__/products';
import { ProductListToolbar } from '../components/product/product-list-toolbar';
import { ProductCard } from '../components/product/product-card';
import { DashboardLayout } from '../components/dashboard-layout';

const Page = () => (
  <>
    <Head>
      <title>
        Players | FiveMUP
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
        zIndex: 99,
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
      <Container maxWidth={false}>
        <ProductListToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {/* {products.map((product) => (
              <Grid
                item
                key={product.id}
                lg={4}
                md={6}
                xs={12}
              >
                <ProductCard product={product} />
              </Grid>
            ))} */}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color="primary"
            count={3}
            size="small"
          />
        </Box>
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
