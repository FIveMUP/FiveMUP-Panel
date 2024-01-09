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
import { GenerateInput } from './GenerateInput';
import { useRouter } from 'next/router';
import { Edit } from '@mui/icons-material';
import { EditSchedulerModal } from './EditSchedulerModal';
import { EditAttributes } from '@mui/icons-material';
import { LocalShippingSharp } from '@mui/icons-material';
import { EditOff } from '@mui/icons-material';
import { EditResourcesModal } from './EditResourcesModal';
import { Clock } from '../../icons/clock';

export const ServerListResults = ({ servers_id, auth_token, ...rest }) => {
  const [selectedServerIds, setSelectedServerIds] = useState([]);
  const [limit, setLimit] = useState(1000);
  const [modalOpen, setModalOpen] = useState(false);
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false);
  const [editingServer, setEditingServer] = useState(null);
  const [page, setPage] = useState(0);
  const [remainingPlayers, setRemainingPlayers] = useState(0);

  const router = useRouter()

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

  const deleteServer = async (server_id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/server/delete?auth_token=${auth_token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        server_id
      })
    })

    const { message } = await res.json();

    if (!res.ok) {
      window.alert(`Error: ${message} for server ${server_id}`);
    }

    router.reload()
  }

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 100 }}>
          <EditSchedulerModal 
            open={modalOpen} 
            editingServer={editingServer}
            handleClose={() => setModalOpen(!modalOpen)} 
          />
          <EditResourcesModal 
            open={resourcesModalOpen} 
            editingServer={editingServer}
            handleClose={() => setResourcesModalOpen(!resourcesModalOpen)} 
          />
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
                  Scheduler
                </TableCell>
                <TableCell>
                  Resources
                </TableCell>
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
                server ? <TableRow
                  hover
                  key={server.id}
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
                    <Button
                      variant="contained"
                      color="info"
                      
                      sx={{
                        verticalAlign: 'middle',
                        marginLeft: '5px',
                        width: '5px',
                      }}

                      onClick={() => {
                        setEditingServer(server)
                        setModalOpen(!modalOpen)
                      }}
                    >
                      <Clock
                      fontSize='small'
                        sx={{
                          verticalAlign: 'middle',
                        }}
                      />
                      
                    </Button>
                      
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="warning"
                      
                      sx={{
                        verticalAlign: 'middle',
                        marginLeft: '5px',
                        width: '5px',
                      }}

                      onClick={() => {
                        setEditingServer(server)
                        setResourcesModalOpen(!modalOpen)
                      }}
                    >
                      <Edit
                      fontSize='small'
                        sx={{
                          verticalAlign: 'middle',
                        }}
                      />
                      
                    </Button>
                      
                  </TableCell>
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
                      onClick={() => deleteServer(server.id)}
                    >
                      Delete Server
                    </Button>

                  </TableCell>
                </TableRow> : null
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