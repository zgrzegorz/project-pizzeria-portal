import React from 'react';
import styles from './Login.module.scss';
import { FormControl, Input, InputLabel, Paper } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const Login = () => (
  <div className={styles.component}>
    <Paper className={styles.paper}>
      <h2>Login</h2>
      <FormControl>
        <InputLabel htmlFor="my-input">Email address</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
      </FormControl> <br></br>
      <FormControl>
        <InputLabel htmlFor="my-input">Password</InputLabel>
        <Input id="my-input" aria-describedby="my-helper-text" />
      </FormControl>
      <Button className={styles.button} component={Link} to={`${process.env.PUBLIC_URL}/`}>Log in</Button>
    </Paper>
  </div>
);

export default Login;
