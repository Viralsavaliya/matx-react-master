import { CssBaseline } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { MatxTheme } from './components';
import { AuthProvider } from './contexts/JWTAuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import routes from './routes';

import { QueryClient, QueryClientProvider } from 'react-query'
const App = () => {
  const content = useRoutes(routes);
  const queryClient = new QueryClient()
  return (
    
    <QueryClientProvider client={queryClient}>
    <SettingsProvider>
      <AuthProvider>
        <MatxTheme>
          <CssBaseline />
          {content}
        </MatxTheme>
      </AuthProvider>
    </SettingsProvider>
    </QueryClientProvider>
  );
};

export default App;
