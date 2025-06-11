import { Provider } from 'react-redux';
import store from './store';

// Redux provider
const ReduxProvider = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
