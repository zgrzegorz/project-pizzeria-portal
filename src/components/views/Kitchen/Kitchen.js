import React from 'react';
import styles from './Kitchen.module.scss';
import { Link } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const demoContent = [
  { id: '1', hour: '12:05', orderId: 25, tableId: 1, products: ['Coke ', 'Pizza'] },
  { id: '2', hour: '12:15', orderId: 70, products: ['Fanta ', 'Salad'] },
  { id: '3', hour: '12:30', orderId: 1, tableId: 3, products: ['water ', 'Pasta'] },
];

const Kitchen = () => (
  <div className={styles.component}>
    <h2>Kitchen view</h2>
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order time</TableCell>
            <TableCell>Table</TableCell>
            <TableCell>Order</TableCell>
            <TableCell>Ordered dishes</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {demoContent.map(row => (
            <TableRow key={row.hour}>
              <TableCell component="th" scope="row">
                {row.hour}
              </TableCell>
              <TableCell>
                {row.tableId}
              </TableCell>
              <TableCell>
                {row.orderId}
              </TableCell>
              <TableCell>
                {row.products}
              </TableCell>
              <TableCell>
                <Button component={Link} to={`${process.env.PUBLIC_URL}/`}>
                  done
                </Button>
              </TableCell>
              <TableCell>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </div>
);

export default Kitchen;
