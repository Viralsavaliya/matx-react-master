import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import FormControlLabel from '@mui/material/FormControlLabel';

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Radio,
  RadioGroup,
  Container,
  TextField,
  Typography,
  styled,
  Paper
} from "@mui/material";

import axios from "axios";
import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";







function ViewAllPost() {
  const [post, setpost] = useState([]);


  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = ` ${token}`;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    fontSize: "20px",
    margin: "10px",
  }));

  const getallpost = () => {
    axios.get(`http://localhost:3000/api/post`)
      .then((res) => {
        console.log(res.data.data.data);
        setpost(res.data.data);
      })
  };


  useEffect(() => {
    getallpost();
  }, []);






  return (
    <div>
      <Container >
        <Grid container spacing={2} style={{ border: "1px solid black", margin: "10px 0 ", borderRadius: "15px", padding: "5px" }}>
          <Grid xs={12} style={{ textAlign: "center" }}>
            <h1>View Post</h1>
          </Grid>
          {post.map((user) => (
            <Grid  container direction="row" justifyContent="center" alignItems="center"  xs={12}>
              <Grid  xs={10} sm={12}>
                <img src={"http://localhost:3000/" + user?.image} style={{ objectFit: "contain" }} width="100%" height="400px" alt="" srcset="" />

              </Grid>
              <Grid xs={12}  md={7}>
                <Item><b>Title:</b>  {user?.title}</Item>
                <Item><b>Discripation:</b><p dangerouslySetInnerHTML={{ __html: user.discripation }} /></Item>
              </Grid>
            </Grid>
          ))}

        </Grid>
      </Container>
    </div>
  )
}

export default ViewAllPost;

