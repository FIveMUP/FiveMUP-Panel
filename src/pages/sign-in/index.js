import { useState, useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, Grid, Tab, Tabs, TextField, Typography } from '@mui/material';
import { auth, ENABLE_AUTH } from '../../lib/auth';
import { Logo } from '../../components/logo';
import useAuthStore from '../../contexts/auth-context';
import { useRouter } from 'next/router';

const Page = () => {
  const [tab, setTab] = useState('email');
  const [emailSent, setEmailSent] = useState(false);
  const { signIn, isAuthenticate } = useAuthStore();
  const router = useRouter()

  console.log('loaded')
  
  useEffect(() => {
    if (user?.token?.length > 0) {
      router.replace('/');
    }
  }, [user, router]);

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
        const { error, token } = await auth.login(values.username, values.password);

        if (error) {
          console.log("Error");
          helpers.setErrors({
            submit: error
          });
          return;
        }

        signIn(token);
      } catch (err) {
        console.error(err);
        helpers.setSubmitting(false);
        helpers.setErrors(err.response.data);
      }
    }
  });

  const handleTabChange = (event, value) => {
    setTab(value);
  };

  const handleRetry = () => {
    setEmailSent(false);
  };

  return (
    <>
      <Head>
        <title>Sign in | Material Kit</title>
      </Head>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flex: '1 1 auto'
        }}
      >
        <Grid
          container
          sx={{ flex: '1 1 auto' }}
        >
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              backgroundColor: 'neutral.50',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                p: 3
              }}
            >
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <Logo
                    sx={{
                      height: 42,
                      width: 42
                    }}
                  />
                </a>
              </NextLink>
            </Box>
            <Box
              sx={{
                flex: '1 1 auto',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Box
                sx={{
                  maxWidth: 500,
                  px: 3,
                  py: '100px',
                  width: '100%'
                }}
              >
                {emailSent ? (
                  <div>
                    <Typography
                      sx={{ mb: 1 }}
                      variant="h4"
                    >
                      Confirm your email
                    </Typography>
                    <Typography>
                      We emailed a magic link to&nbsp;
                      <Box
                        component="span"
                        sx={{
                          color: 'primary.main'
                        }}
                      >
                        {formik.values.email}
                      </Box>
                      <br />
                      Click the link to to log in.
                    </Typography>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        gap: 3,
                        mt: 3
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        Wrong email?
                      </Typography>
                      <Button
                        color="inherit"
                        onClick={handleRetry}
                      >
                        Use a different email
                      </Button>
                    </Box>
                  </div>
                ) : (
                  <div>
                    <Typography
                      sx={{ mb: 1 }}
                      variant="h4"
                    >
                      Welcome
                    </Typography>
                    <Typography
                      color="text.secondary"
                      sx={{ mb: 3 }}
                      variant="body2"
                    >
                      Sign up on the internal platform
                    </Typography>
                    <Tabs
                      onChange={handleTabChange}
                      sx={{ mb: 3 }}
                      value={tab}
                    >
                      <Tab
                        label="Email"
                        value="email"
                      />
                      <Tab
                        label="Phone Number"
                        value="phoneNumber"
                      />
                    </Tabs>
                    {tab === 'email' && (
                      <div>
                        <TextField
                          error={Boolean(formik.touched.username && formik.errors.username)}
                          fullWidth
                          helperText={formik.touched.username && formik.errors.username}
                          label="Username"
                          name="username"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="username"
                          value={formik.values.username}
                          variant="outlined"
                          style={{
                            marginBottom: '10px'
                          }}
                        />
                        <TextField
                          error={Boolean(formik.touched.password && formik.errors.password)}
                          fullWidth
                          helperText={formik.touched.password && formik.errors.password}
                          label="Password"
                          name="password"
                          onBlur={formik.handleBlur}
                          onChange={formik.handleChange}
                          type="password"
                          value={formik.values.password}
                          variant="outlined"
                        />
                        {formik.errors.submit && (
                          <Typography
                            color="error"
                            sx={{ mt: 2 }}
                            variant="body2"
                          >
                            {formik.errors.submit}
                          </Typography>
                        )}
                        <Button
                          fullWidth
                          size="large"
                          sx={{ mt: 3 }}
                          onClick={() => formik.handleSubmit()}
                          variant="contained"
                        >
                          Continue
                        </Button>
                      </div>
                    )}
                    {tab === 'phoneNumber' && (
                      <div>
                        <Typography
                          sx={{ mb: 1 }}
                          variant="h6"
                        >
                          Not available in the demo
                        </Typography>
                        <Typography color="text.secondary">
                          Zalter Identity does support SMS passcodes, but to prevent unnecessary costs we disabled this feature in the demo.
                        </Typography>
                      </div>
                    )}
                  </div>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            lg={6}
            sx={{
              alignItems: 'center',
              background: 'radial-gradient(50% 50% at 50% 50%, #122647 0%, #090E23 100%)',
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              '& img': {
                maxWidth: '100%'
              }
            }}
          >
            <Box sx={{ p: 3 }}>
              <Typography
                align="center"
                color="inherit"
                sx={{
                  fontSize: '24px',
                  lineHeight: '32px',
                  mb: 1
                }}
                variant="h1"
              >
                Authentication sponsored by&nbsp;
                <Box
                  component="span"
                  sx={{
                    color: '#15B79E',
                    borderBottom: '2px solid #15B79E'
                  }}
                >
                  zalter.com
                </Box>
              </Typography>
              <Typography
                align="center"
                sx={{ mb: 3 }}
                variant="subtitle1"
              >
                Create secure, seamless user experiences with Zalter Passwordless Authentication.
              </Typography>
              <img
                alt=""
                src="/static/images/login-illustration.svg"
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Page;
