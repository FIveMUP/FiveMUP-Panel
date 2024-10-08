import Head from 'next/head';
import NextLink from 'next/link';
import Router, { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Facebook as FacebookIcon } from '../icons/facebook';
import { Google as GoogleIcon } from '../icons/google';
import useAuthStore from '../contexts/auth-context';
import { useEffect } from 'react';
import { auth } from '../lib/auth';
import { fi } from 'date-fns/locale';

const Login = () => {

  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      submit: null
    },
    validationSchema: Yup.object({
      username: Yup.string().required('Username is required'),
      password: Yup.string().max(32).required('Password is required')
    }),
    onSubmit: async (values, helpers) => {
      try {
        const { error } = await auth.login(values.username, values.password);

        if (error) {
          console.log("Error");
          helpers.setErrors({
            submit: error
          });
          return;
        }

        router.reload();
      } catch (err) {
        console.error(err);
        helpers.setSubmitting(false);
        helpers.setErrors(err.response.data);
      }
    }
  });

  return (
    <>
      <Head>
        <title>Login | FiveMUP</title>
      </Head>
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: 'rgba(22,25,35,0.9)',
          height: '100%',
          width: '100%',
          top: 0,
          zIndex: -2,
          backgroundImage: 'url(/static/images/logo.gif)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          filter: 'brightness(0.2)'
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: 'rgba(22,25,35,0.4)',
          backdropFilter: 'blur(20px)',
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          minHeight: '100px',
          height: '100%',
          width: '100%',
          top: 0,
          zIndex: -1
        }}
      />
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%'
        }}
      >
        <Container maxWidth="sm">
          <NextLink
            href="/"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Log In
            </Button>
          </NextLink>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              error={Boolean(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Username"
              margin="normal"
              name="username"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="username"
              value={formik.values.email}
              variant="outlined"
            />
            <TextField
              error={Boolean(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              margin="normal"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
              variant="outlined"
            />

            <Typography
              color="error"
              sx={{
                mt: 1,
              }}
              variant="inherit"
            >
              {formik.errors.submit ? formik.errors.submit : "ㅤ"}
            </Typography>

            <Box sx={{ py: 2 }}>
              <Button
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Sign In Now
              </Button>
            </Box>
            <Typography
              color="textSecondary"
              variant="body2"
            >
              Don&apos;t have an account?
              {' '}
              <NextLink
                href="/login"
              >
                <Link
                  to="/login"
                  variant="subtitle2"
                  underline="hover"
                  sx={{
                    cursor: 'pointer'
                  }}
                >
                  (Coming Soon)
                </Link>
              </NextLink>
            </Typography>
          </form>
        </Container>
      </Box>
    </>
  );
};

export default Login;
