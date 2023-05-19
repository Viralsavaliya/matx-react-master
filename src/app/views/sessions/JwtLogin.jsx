import { LoadingButton } from '@mui/lab';
import { Card, Checkbox, Grid, TextField } from '@mui/material';
import { Box, styled, useTheme } from '@mui/material';
import { Paragraph } from 'app/components/Typography';
import useAuth from 'app/hooks/useAuth';
import { Formik } from 'formik';
import { useState , useReducer} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {auth} from '../../components/config';
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import GoogleIcon from '@mui/icons-material/Google';
import GithubIcon from '@mui/icons-material/GitHub';
import { signInWithPopup ,GoogleAuthProvider  , GithubAuthProvider  } from "firebase/auth";
import {Button} from "@mui/material";

const FlexBox = styled(Box)(() => ({ display: 'flex', alignItems: 'center' }));

const JustifyBox = styled(FlexBox)(() => ({ justifyContent: 'center' }));

const ContentBox = styled(Box)(() => ({
  height: '100%',
  padding: '32px',
  position: 'relative',
  background: 'rgba(0, 0, 0, 0.01)'
}));

const initialState = {
  user: null,
  isInitialised: false,
  isAuthenticated: false
};

const reducer = (state, action) => {
  switch (action.type) {

    case 'LOGIN': {
      const { user } = action.payload;
      console.log(user,"username")
      return { ...state, isAuthenticated: true, user };
      // console.log(isAuthenticated)
      
    }
    default:
      return state;
  }
};

const JWTRoot = styled(JustifyBox)(() => ({
  background: '#1A2038',
  minHeight: '100% !important',
  '& .card': {
    maxWidth: 800,
    minHeight: 400,
    margin: '1rem',
    display: 'flex',
    borderRadius: 12,
    alignItems: 'center'
  }
}));

// inital login credentials
const initialValues = {
  email: '',
  password: '',
  remember: true
};


// form field validation schema
const validationSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'Password must be 6 character length')
    .required('Password is required!'),
  email: Yup.string().email('Invalid Email address').required('Email is required!')
});

const JwtLogin = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { login } = useAuth();

  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate('/');
    } catch (e) {
      setLoading(false);
    }
  };
  const handleclick = async () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then((data) => {
      const userdata = {
        userEmail: data.user.email,
        googleId: data.user.uid,
        name: data.user.displayName
      }
      // setvalue(data.user)
      axios.post('http://localhost:3000/api/auth/login', userdata)
        .then((res) => {
          localStorage.setItem('token', "Breaer" + " " + res.data.data.token);
          const user  = res.data.data.user;
          // console.log(res.data.data.user,"user");
          dispatch({ type: 'LOGIN', payload: { user } });
          // navigate('/dashboard/default')
          if (res) {
            enqueueSnackbar(
              res.data.message,
              { variant: "success" },
              { autoHideDuration: 1000 }
            );
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            enqueueSnackbar(
              error.response.data.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        });
    })
  }

  const handleclickgithub = async () => {
    console.log("github");
    const provider = new GithubAuthProvider();
    console.log("github11");

    signInWithPopup(auth, provider).then((data) => {
      console.log(data);
      const userdata = {
        userEmail: data.user.email,
        githubId: data.user.uid,
        name: data.user.displayName
      }
      // setvalue(data.user)
      axios.post('http://localhost:3000/api/auth/login', userdata)
        .then((res) => {
          // localStorage.setItem('token', token);
          console.log(res, 'res')
          if (res) {
            navigate('/dashboard/default')
            localStorage.setItem('token', "Breaer" + " " + res.data.data);
            enqueueSnackbar(
              res.data.message,
              { variant: "success" },
              { autoHideDuration: 1000 }
            );
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            enqueueSnackbar(
              error.response.data.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        });
    })
  }

  return (
    <JWTRoot>
      <Card className="card">
        <Grid container>
          <Grid item sm={6} xs={12}>
            <JustifyBox p={4} height="100%" sx={{ minWidth: 320 }}>
              <img src="/assets/images/illustrations/dreamer.svg" width="100%" alt="" />
            </JustifyBox>
          </Grid>

          <Grid item sm={6} xs={12}>
            <ContentBox>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={validationSchema}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                    <TextField
                      fullWidth
                      size="small"
                      type="email"
                      name="email"
                      label="Email"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.email}
                      onChange={handleChange}
                      helperText={touched.email && errors.email}
                      error={Boolean(errors.email && touched.email)}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      fullWidth
                      size="small"
                      name="password"
                      type="password"
                      label="Password"
                      variant="outlined"
                      onBlur={handleBlur}
                      value={values.password}
                      onChange={handleChange}
                      helperText={touched.password && errors.password}
                      error={Boolean(errors.password && touched.password)}
                      // sx={{ mb: 1.5 }}
                    />

                    <FlexBox justifyContent="space-between">
                      <FlexBox gap={1}>
                        <Checkbox
                          size="small"
                          name="remember"
                          onChange={handleChange}
                          checked={values.remember}
                          sx={{ padding: 0 }}
                        />

                        <Paragraph>Remember Me</Paragraph>
                      </FlexBox>

                      <NavLink
                        to="/session/forgot-password"
                        style={{ color: theme.palette.primary.main }}
                      >
                        Forgot password?
                      </NavLink>
                    </FlexBox>

                    <LoadingButton
                      type="submit"
                      color="primary"
                      loading={loading}
                      variant="contained"
                      sx={{ my: 2 }}
                    >
                      Login
                    </LoadingButton>

                    <Paragraph>
                      Don't have an account?
                      <NavLink
                        to="/session/signup"
                        style={{ color: theme.palette.primary.main, marginLeft: 5 }}
                      >
                        Register
                      </NavLink>
                    </Paragraph>
                  </form>
                )}
              </Formik>
        <Grid xs={24} style={{display:"flex"}}>
        <Button style={{boxShadow:"2px 2px 2px black inset" , padding: "0 3px" , marginRight:"8px"}} onClick={handleclick} ><GoogleIcon /><p style={{paddingLeft:6}}> Sign in with Google</p></Button>
        <Button style={{boxShadow:"2px 2px 2px black inset", padding:"0 3px"}} onClick={handleclickgithub} ><GithubIcon /><p style={{paddingLeft:6}}> Sign in with Github</p></Button>
          </Grid>
            </ContentBox>
      </Grid>
        </Grid>
      </Card>
      
    </JWTRoot>
  );
};

export default JwtLogin;
