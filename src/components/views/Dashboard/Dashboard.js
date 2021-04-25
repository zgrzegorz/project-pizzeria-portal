import React from 'react';
import styles from './Dashboard.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const demoContent = [
  { id: '1', hour: '12:00', status: 'reservation', orderId: 23, tableNumber: 'Table 1' },
  { id: '2', hour: '12:30', status: 'event', orderId: 24, tableNumber: 'Table 2' },
  { id: '3', hour: '13:00', status: 'reservation', orderId: 25, tableNumber: 'Table 3' },
  { id: '4', hour: '13:30', status: 'event', orderId: 26, tableNumber: 'Table 2' },
];

const Dashboard = (status, renderStatus) => (
  <div className={styles.component}>
    <h2>Statistics</h2>
    <Paper className={styles.component}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Number of Local Orders</TableCell>
            <TableCell>Number of Remote Orders</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>25</TableCell>
            <TableCell>50</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
    <h2>Reservation and Events list</h2>
    <Paper className={styles.component}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Reservation/Event</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Table</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {demoContent.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">{row.status}</TableCell>
              <TableCell>{row.hour}</TableCell>
              <TableCell>{row.tableNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </div>
);
export default Dashboard;
