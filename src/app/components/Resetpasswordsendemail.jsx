
import {
  Box,
  Button,
  Grid,
  SvgIcon,
  TextField,
  Typography,
  Stack
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';




function Resetpasswordsendemail() {

  const [blog, setblog] = useState([]);
  const [user, setuser] = useState("");
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(Date.now());
  const navigate = useNavigate();

  const getusers = () => {
    axios.get('http://localhost:3000/api/profile')
      .then((res) => {
        setuser(res.data.data);
      })

  };

  useEffect(() => {
    getusers();
  }, []);



  // const { mutateAsync: cratestate } = useMutation(async (value) => {
  //   await axios
  //     .post(`http://localhost:3000/api/auth/forget-password`, value)
  //     setLoading(true);
  //     setApiCallDuration(4000)
  //     .then((res) => {
      
  //       console.log(res.data);
  //       const token = res.data.data
  //       localStorage.setItem('token', 'Bearer' + " " + token);
  //       if (res) {
  //         console.log("Email send  Successfully");
  //         enqueueSnackbar(
  //           res.data.message,
  //           { variant: "success" },
  //           { autoHideDuration: 1000 }
  //         );
  //         navigate('/verificationotp')
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.response.status === 400) {
  //         console.log("axios error");
  //         enqueueSnackbar(
  //           error.response.data.message,
  //           { variant: "error" },
  //           { autoHideDuration: 1000 }
  //         );
  //       }
  //     } finally {
  //       setLoading(false); // Reset the loading state once the API call is completed
  //     }
  //     );
  // });


  const { mutateAsync: cratestate } = useMutation(async (value) => {
    setLoading(true);
  
    try {
      const res = await axios.post(
        `http://localhost:3000/api/auth/forget-password`,
        value
      );
  
      console.log(res.data);
      const token = res.data.data;
      localStorage.setItem('token', 'Bearer' + ' ' + token);
      if (res) {
        console.log('Email send Successfully');
        enqueueSnackbar(res.data.message, { variant: 'success' });
        navigate('/verificationotp');
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log('axios error');
        enqueueSnackbar(error.response.data.message, { variant: 'error' });
      }
    } finally {
      setLoading(false); 
    }
  });
  

  const validationSchema = yup.object({
    email: yup
      .string("Enter Your password")
      .min(2, "Min length")
      .max(50, "Max length")
      .required("password is Required"),
  });



  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await cratestate({
        email: values.email,
      });

    },
  });
  const { handleChange, handleSubmit } = formik;







  return (
    <div>
      <div style={{ textAlign: "center", width: "100%" }}>
        <h1>Reset password send email</h1>
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
                    id="email"
                    name="email"
                    label="Email"
                    type="email"
                    value={formik.values.email || blog.email}
                    onChange={handleChange}
                    error={
                      formik.touched.email && Boolean(formik.errors.email)
                    }
                    helperText={
                      formik.touched.email && formik.errors.email
                    }
                  />
                </Grid>


                <Grid xs={6}>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                  >
                    Send Mail 
                    {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <CircularProgress  size={20} />
                    </div>
                  )}
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

export default Resetpasswordsendemail