  import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { MatxLoading } from 'app/components';

const initialState = {
  user: null,
  isInitialised: false,
  isAuthenticated: false
};

// const isValidToken = (accessToken) => {
//   if (!accessToken) return false;

//   const decodedToken = jwtDecode(accessToken);
//   const currentTime = Date.now() / 1000;
//   return decodedToken.exp > currentTime;
// };

// const setSession = (accessToken) => {
//   if (accessToken) {
//     localStorage.setItem('accessToken', accessToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//   } else {
//     localStorage.removeItem('accessToken');
//     delete axios.defaults.headers.common.Authorization;
//   }
// };

const reducer = (state, action) => {
  switch (action.type) {
    case 'INIT': {
      const { isAuthenticated, user } = action.payload;
      return { ...state, isAuthenticated, isInitialised: true, user };
    }

    case 'LOGIN': {
      console.log(state,"loginstate")
      const { user } = action.payload;
      console.log({user});
      return { ...state, isAuthenticated: true, user };
    }

    case 'LOGOUT': {
      return { ...state, isAuthenticated: false, user: null };
    }

    case 'REGISTER': {
      const { user } = action.payload;

      return { ...state, isAuthenticated: true, user };
    }

    default:
      return state;
  }
};

const AuthContext = createContext({
  ...initialState,
  method: 'JWT',
  login: () => {},
  googleLogin: () => {},
  githubLogin: () => {},
  logout: () => {},
  register: () => {}
});

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    const  { user } = response.data.data;
    const  { token } = response.data.data;
    localStorage.setItem('token', 'Bearer'+ " " + token);
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const googleLogin = async (data) => {
    const response = await axios.post('http://localhost:3000/api/auth/login',data);
    const  { user } = response.data.data;
    const  { token } = response.data.data;
    localStorage.setItem('token', 'Bearer'+ " " + token);
    dispatch({ type: 'LOGIN', payload: { user } });
    console.log(user)
  };
  const githubLogin = async (data) => {
    const response = await axios.post('http://localhost:3000/api/auth/login',data);
    const  { user } = response.data.data;
    const  { token } = response.data.data;
    localStorage.setItem('token', 'Bearer'+ " " + token);
    dispatch({ type: 'LOGIN', payload: { user } });
  };

  const register = async (email, userName, password) => {
    const response = await axios.post('http://localhost:3000/api/auth/register', { email, userName, password });
    const { user } = response.data;

    dispatch({ type: 'REGISTER', payload: { user } });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = ` ${token}`;
        const { data } = await axios.get('http://localhost:3000/api/profile');
        dispatch({ type: 'INIT', payload: { isAuthenticated: true, user: data.user } });
      } catch (err) {
        console.error(err);
        dispatch({ type: 'INIT', payload: { isAuthenticated: false, user: null } });
      }
    })();
  }, []);

  // SHOW LOADER
  if (!state.isInitialised) return <MatxLoading />;

  return (
    <AuthContext.Provider value={{ ...state, method: 'JWT', login, logout, register,googleLogin ,githubLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
