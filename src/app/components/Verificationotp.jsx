
import {
    Box,
    Button,
    Grid,
    SvgIcon,
    TextField,
    Typography,
  } from "@mui/material";
  import axios from "axios";
  import { useFormik } from "formik";
  import { enqueueSnackbar } from "notistack";
  import React, { useEffect, useState } from "react";
  import { useMutation } from "react-query";
  import * as yup from "yup";
  import { useNavigate } from "react-router-dom";
  // import {auth} from './config';
  // import { signInWithPopup ,GoogleAuthProvider , FacebookAuthProvider , GithubAuthProvider , TwitterAuthProvider} from "firebase/auth";
  
 
  function Verificationotp() {
  
    const [blog, setblog] = useState([]);
    const [user, setuser] = useState("");
  
    const [value, setValue] = useState(Date.now());
    const navigate = useNavigate();
  
    const getusers = () => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = ` ${token}`;
      axios.get('http://localhost:3000/api/profile')
        .then((res) => {
          setuser(res.data.data);
        })
  
    };
  
    useEffect(() => {
      getusers();
    }, []);
  
   
    
  
    const { mutateAsync: cratestate } = useMutation(async (value) => {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = ` ${token}`;
      await axios
        .post(`http://localhost:3000/api/auth/verificationotp`, value)
        .then((res) => {
          if (res) {
            console.log("Email send  Successfully");
            enqueueSnackbar(
              res.data.message,
              { variant: "success" },
              { autoHideDuration: 1000 }
            );
            navigate('/forgetpassword')
          }
        })
        .catch((error) => {
          if (error.response.status === 400) {
            console.log("axios error");
            enqueueSnackbar(
              error.response.data.message,
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        });
    });
  
   
    const validationSchema = yup.object({
        otp: yup
          .string("Enter Your password")
            .min(2, "Min length")
            .max(50, "Max length")
            .required("password is Required"),
  });
  
  
  
    const formik = useFormik({
      initialValues: {
        otp: "",
      },
      validationSchema: validationSchema,
      onSubmit: async (values) => {
        await cratestate({
          otp: values.otp,
        });
  
      },
    });
    const { handleChange, handleSubmit } = formik;
  
  
  
  
  
  
  
    return (
      <div>
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1>Verification otp</h1>
          <div>
            <Typography sx={{ p: 2 }}>
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  columns={11}
                  spacing={0}
                  alignItems="center"
                  justifyContent="center"
                >
                 
                  <Grid xs={6} mb={1}>
                    <TextField
                      fullWidth
                      id="otp"
                      name="otp"
                      label="OTP"
                      value={formik.values.otp || blog.otp}
                      onChange={handleChange}
                      error={
                        formik.touched.otp && Boolean(formik.errors.otp)
                      }
                      helperText={
                        formik.touched.otp && formik.errors.otp
                      }
                    />
                  </Grid>
  
                  <Grid xs={6}>
                    <Button
                      type="submit"
                      color="primary"
                      variant="contained"
                      fullWidth
                    >
                     Verify OTP
                    </Button>
                  </Grid>
                </Grid>
              </form>
  
            </Typography>
          </div>
        </div>
      </div>
    );
  }
  
  export default Verificationotp