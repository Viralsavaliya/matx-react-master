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
    boxShadow: "0 0 0 0 white",
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
            <Grid container direction="row" justifyContent="center" alignItems="center" xs={12}>
              <Grid  md={7} sm={12} border="1px solid gray" style={{borderRadius:"20px",marginBottom:"15px"}}>
                <Grid xs={12}>
                  <Item><img src={"http://localhost:3000/" + user?.userid.image} style={{ objectFit: "cover", borderRadius: "50%", margin: " 0 0 -15px 0" }} sm={12} width="40" height="40" alt="" srcset="" /><span style={{ margin: " 0 0 0 15px" }}>{user?.userid.userName}</span>  </Item>
                </Grid>
                <Grid xs={12} sm={12}>
                  <img src={"http://localhost:3000/" + user?.image} style={{ objectFit: "contain" }} width="100%" height="400px" alt="" srcset="" />
                </Grid>
                <Grid xs={12} md={12}>
                  <Item>{user?.title}</Item>
                  <Item ><p style={{margin:"-40px 0 -22px 0px"}} dangerouslySetInnerHTML={{ __html: user.discripation }} /></Item>
                </Grid>
              </Grid>
            </Grid>
          ))}

        </Grid>
      </Container>
    </div>
  )
}

export default ViewAllPost;

