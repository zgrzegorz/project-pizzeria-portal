import React from 'react';
import PropTypes from 'prop-types';
import styles from './Waiter.module.scss';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class Waiter extends React.Component {
  static propTypes = {
    fetchTables: PropTypes.func,
    loading: PropTypes.shape({
      active: PropTypes.bool,
      error: oneOfType([PropTypes.bool, PropTypes.string]),
    }),
    tables: PropTypes.any,
    changedStatus: PropTypes.func,
  }

  componentDidMount() {
    const { fetchTables } = this.props;
    fetchTables();
  }

  statusChanger(row) {
    if (row.status === 'free') {
      row.status = 'thinking';
    }
    else if (row.status === 'thinking') {
      row.status = 'ordered';
    }
    else if (row.status === 'ordered') {
      row.status = 'prepared';
    }
    else if (row.status === 'prepared') {
      row.status = 'delivered';
    }
    else if (row.status === 'delivered') {
      row.status = 'paid';
    }
    else if (row.status === 'paid') {
      row.status = 'free';
    }
    const { changedStatus } = this.props;
    changedStatus(row);
  }

  renderActions(row) {
    const status = row.status;
    switch (status) {
      case 'free':
        return (
          <>
            <Button onClick={() => { this.statusChanger(row); }}>thinking</Button>
            <Button onClick={() => { this.statusChanger(row); }}>new order</Button>
          </>
        );
      case 'thinking':
        return (
          <Button onClick={() => { this.statusChanger(row); }}>new order</Button>
        );
      case 'ordered':
        return (
          <Button onClick={() => { this.statusChanger(row); }}>prepared</Button>
        );
      case 'prepared':
        return (
          <Button onClick={() => { this.statusChanger(row); }}>delivered</Button>
        );
      case 'delivered':
        return (
          <Button onClick={() => { this.statusChanger(row); }}>paid</Button>
        );
      case 'paid':
        return (
          <Button onClick={() => { this.statusChanger(row); }}>free</Button>
        );
      default:
        return null;
    }
  }
  render() {
    // eslint-disable-next-line react/prop-types
    const { loading: { active, error }, tables } = this.props;
    // eslint-disable-next-line react/prop-types
    if (active || !tables.length) {
      return (
        <Paper className={styles.component}>
          <p>Loading...</p>
        </Paper>
      );
    } else if (error) {
      return (
        <Paper className={styles.component}>
          <p>Error! Details:</p>
          <pre>{error}</pre>
        </Paper>
      );
    } else {
      return (
        <Paper className={styles.component}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Number</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Order</TableCell>
                <TableCell>Table number</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/*eslint-disable-next-line react/prop-types*/}
              {tables.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <TableCell>
                    {row.status}
                  </TableCell>
                  <TableCell>
                    {row.orderId && (
                      <Button to={`${process.env.PUBLIC_URL}/waiter/order/${row.orderId}`}>
                        {row.orderId}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    {row.tableId}
                  </TableCell>
                  <TableCell>
                    {this.renderActions(row)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      );
    }
  }
}
export default Waiter;
