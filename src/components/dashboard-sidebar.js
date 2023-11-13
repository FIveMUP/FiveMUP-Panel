import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Box, Button, Divider, Drawer, Icon, Typography, useMediaQuery } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { ChartBar as ChartBarIcon } from '../icons/chart-bar';
import { Cog as CogIcon } from '../icons/cog';
import { Lock as LockIcon } from '../icons/lock';
import { Selector as SelectorIcon } from '../icons/selector';
import { ShoppingBag as ShoppingBagIcon } from '../icons/shopping-bag';
import { User as UserIcon } from '../icons/user';
import { UserAdd as UserAddIcon } from '../icons/user-add';
import { Users as UsersIcon } from '../icons/users';
import { XCircle as XCircleIcon } from '../icons/x-circle';
import { Logo } from './logo';
import { NavItem } from './nav-item';
import { borderLeft } from '@mui/system';
import { Image } from '@mui/icons-material';
import { Storage } from '@mui/icons-material';
import { ConnectWithoutContact } from '@mui/icons-material';
import { SettingsAccessibility } from '@mui/icons-material';
import { SettingsApplications } from '@mui/icons-material';
import { Download } from '@mui/icons-material';

const items = [
  {
    href: '/',
    icon: (<ChartBarIcon fontSize="small" />),
    title: '🚧 Dashboard'
  },
  {
    href: '/servers',
    icon: (<Storage fontSize="small" />),
    title: 'My Servers'
  },
  {
    href: '/players',
    icon: (<ConnectWithoutContact fontSize="small" />),
    title: 'Players'
  },
  {
    href: '/account',
    icon: (<SettingsAccessibility fontSize="small" />),
    title: '🚧 Account'
  },
  {
    href: '/settings',
    icon: (<CogIcon fontSize="small" />),
    title: '🚧 Settings'
  },
];

export const DashboardSidebar = (props) => {
  const { open, onClose } = props;
  const router = useRouter();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const handleDownload = () => {
    window.open('https://cdn.discordapp.com/attachments/963224851735257139/1173413994481061939/FiveMUP_Files.zip', '_blank');
  }

  useEffect(
    () => {
      if (!router.isReady) {
        return;
      }

      if (open) {
        onClose?.();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.asPath]
  );

  const content = (
    <>
      <Box
        sx={{
          backgroundImage: 'url(/static/images/logo.gif)',
          backgroundPosition: 'center',
          height: '100%',
          position: 'absolute',
          width: '100%',
          zIndex: -1
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          backgroundColor: 'rgba(22,25,35, 0.9)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div>
          <Box sx={{ p: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
           }}>
            <NextLink
              href="/"
              passHref
            >
              <a>
                <Box 
                  sx={{
                    backgroundImage: 'url(/static/images/logo.gif)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 55,
                    width: 55,
                    borderRadius: 1,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    overflow: 'hidden'
                  }}
                />
              </a>
            </NextLink>
          </Box>
          <Box sx={{ px: 2 }}>
            <Box
              sx={{
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                px: 3,
                py: '11px',
                borderRadius: 1
              }}
            >
              <div>
                <Typography
                  color="inherit"
                  variant="subtitle1"
                >
                  FiveMUP - Software
                </Typography>
                <Typography
                  color="neutral.400"
                  variant="body2"
                >
                  Your plan: Customer
                </Typography>
              </div>
              <SelectorIcon
                sx={{
                  color: 'neutral.500',
                  width: 14,
                  height: 14
                }}
              />
            </Box>
          </Box>
        </div>
        <Divider
          sx={{
            borderColor: '#2D3748',
            my: 3
          }}
        />
        <Box sx={{ flexGrow: 1 }}>
          {items.map((item) => (
            <NavItem
              key={item.title}
              icon={item.icon}
              href={item.href}
              title={item.title}
            />
          ))}
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        {/* Download Button */}
        <Box sx={{ p: 2 }}>
          <Button
            color="primary"
            fullWidth
            size="large"
            variant="contained"
            onClick={handleDownload}
            target="_blank"
            startIcon={<Download />}
          >
            Download
          </Button>
        </Box>
        <Divider sx={{ borderColor: '#2D3748' }} />
        <Box sx={{ p: 1 }}>
          <Typography
            color="neutral.400"
            variant="body2"
            // center
            align='center'
          > 
            FiveMUP - Web Panel &copy; 2023
          </Typography>
        </Box>
      </Box>
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280,
            borderRight: '1px solid #2D3748',
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
