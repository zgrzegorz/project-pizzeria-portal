import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import MainLayout from '../src/components/layout/MainLayout/MainLayout';
import Dashboard from '../src/components/views/Dashboard/Dashboard'; // widok strony głównej
import Login from '../src/components/views/Login/Login'; //komponent logowania
import Tables from '../src/components/views/Tables/Tables'; // widok stolików
import Waiter from '../src/components/views/Waiter/WaiterContainer'; // widok kelnera
import Booking from '../src/components/views/Booking/Booking';
import Kitchen from '../src/components/views/Kitchen/Kitchen'; // widok kuchni
import { StylesProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import store from '../src/redux/store';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#2B4C6F' },  // kolor ciemnoniebieski
    //secondary:{main:'#llcb5f'},
  },
});

export const routes = [
  {
    path: '/',
    component: Dashboard,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/tables',
    component: Tables,
  },
  {
    path: '/waiter',
    component: Waiter,
  },
  {
    path: '/kitchen',
    component: Kitchen,
  },
  {
    path: '/tables/booking/:id',
    component: Booking,
  },
];

const App = () => (
  <Provider store={store}>
    < BrowserRouter>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <MainLayout>
            <Switch>
              {/* <Route exact path={process.env.PUBLIC_URL + '/'} component={Dashboard} />
            <Route exact path={process.env.PUBLIC_URL + '/login'} component={Login} />
            <Route exact path={process.env.PUBLIC_URL + '/tables'} component={Tables} />
            <Route exact path={process.env.PUBLIC_URL + '/waiter'} component={Waiter} />
            <Route exact path={process.env.PUBLIC_URL + '/kitchen'} component={Kitchen} /> */}
              {routes.map(route => (
                <Route key={route.path} exact path={`${process.env.PUBLIC_URL}${route.path}`} component={route.component} />
              ))}
            </Switch>
          </MainLayout>
        </StylesProvider>
      </ThemeProvider>
    </BrowserRouter >
  </Provider>
);

export default App;
