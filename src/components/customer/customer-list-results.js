import { useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import { format, min } from 'date-fns';
import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { getInitials } from '../../utils/get-initials';
import { useQueries } from '@tanstack/react-query';
import { borderBottom } from '@mui/system';
import usePlayerStore from '../../contexts/player-context';
import { GenerateInput } from './GenerateInput';

export const ServerListResults = ({ servers_id, auth_token, ...rest }) => {
  const [selectedServerIds, setSelectedServerIds] = useState([]);
  const [limit, setLimit] = useState(1000);
  const [page, setPage] = useState(0);
  const [remainingPlayers, setRemainingPlayers] = useState(0);

  const serverQueries = useQueries({
    queries: servers_id.map((server_id) => ({
      queryKey: ['repoData', server_id],
      queryFn: () =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/retrieve?server_id=${server_id}&auth_token=${auth_token}`).then(
          res => res.json()
        )
    }))
  });

  const isLoading = serverQueries.some(query => query.isLoading);
  if (isLoading) return 'Loading...';

  const firstError = serverQueries.find(query => query.error);
  if (firstError) return 'An error has occurred: ' + firstError.error.message;

  const servers = []

  serverQueries.forEach((query) => {
    if (query.data) {
      servers.push(query.data.server)
    }
  })

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 100 }}>
          <Table
            sx={{
              backgroundColor: 'rgba(25, 21, 21, 0.1)',
            }}
          >
            <TableHead
              sx={{
                backgroundColor: 'rgba(25, 21, 21, 0.4)'
              }}
            >
              <TableRow
                sx={{
                  // centering the text
                  '& th': {
                    textAlign: 'center'
                  }
                }}
              >
                <TableCell>
                  Name
                </TableCell>
                <TableCell>
                  CFX Code
                </TableCell>
                <TableCell>
                  Assigned Players
                </TableCell>
                <TableCell>
                  Status
                </TableCell>
                <TableCell>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{
                backgroundColor: 'rgba(25, 21, 21, 0.1)',
              }}
            >
              {servers.slice(0, limit).map((server) => (
                <TableRow
                  hover
                  key={server.id}
                  selected={selectedServerIds.indexOf(server.id) !== -1}
                  sx={{
                    '&  td, & th': { border: 0 },
                    '& td': {
                      textAlign: 'center',
                      '& div': {
                        justifyContent: 'center'
                      },
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Avatar
                        src={'/static/images/logo.gif'}
                        sx={{ mr: 2 }}
                      />
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {server.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {server.cfxCode}
                  </TableCell>
                  <TableCell>
                    <GenerateInput server={server} />
                  </TableCell>
                  <TableCell>
                    Online
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                    >
                      Delete Server
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
    </Card>
  );
};

ServerListResults.propTypes = {
  servers_id: PropTypes.array
};

ServerListResults.defaultProps = {
  servers_id: [],
};