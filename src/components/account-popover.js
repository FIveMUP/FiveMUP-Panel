import { useContext, useEffect } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Box, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import useAuthStore from '../contexts/auth-context';
import { auth } from '../lib/auth';
import useUserStore from '../contexts/user-context';
import { Skeleton } from '@mui/material/Skeleton';

export const AccountPopover = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const { signOut, isAuthenticated } = useAuthStore()
  const userContext = useUserStore();

  const handleSignOut = async () => {
    onClose?.();

    try {
      // Update Auth Context state
      signOut();

      // Redirect to login page
      Router
        .push('/login')
        .catch(console.error);
    } catch (err) {
      console.error(err);
    }
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      if (isAuthenticated && !userContext.user) {
        const token = auth.getToken();
        const { user } = await userContext.fetchUser(token);
        console.log("User:", user);
      } 
    };
    fetchUser();
  }, [isAuthenticated, userContext]);
  
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: { width: '300px' }
      }}
      {...other}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >

        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          { userContext.username ? userContext.username :  "Loading..." }
        </Typography>
      </Box>
      <MenuList
        disablePadding
        sx={{
          '& > *': {
            '&:first-of-type': {
              borderTopColor: 'divider',
              borderTopStyle: 'solid',
              borderTopWidth: '1px'
            },
            padding: '12px 16px'
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

AccountPopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};
