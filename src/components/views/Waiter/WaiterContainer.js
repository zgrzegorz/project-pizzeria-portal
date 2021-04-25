import { connect } from 'react-redux'
import Waiter from './Waiter';
import { getAll, fetchFromAPI, getLoadingState, changeApiStatus } from '../../../redux/tablesRedux';

const mapStateToProps = (state) => ({
  tables: getAll(state),
  loading: getLoadingState(state),
})

const mapDispatchToProps = (dispatch) => ({
  fetchTables: () => dispatch(fetchFromAPI()),
  changedStatus: (row) => dispatch(changeApiStatus(row)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Waiter);
