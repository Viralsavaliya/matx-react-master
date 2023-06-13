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
import { redirect, useNavigate } from "react-router-dom";
import AllFollowingshow from './AllFollowingshow';
import CircularProgress from '@mui/material/CircularProgress';


const validationSchema = yup.object({
  userName: yup
    .string("Enter Your Name")
    .min(2, "Min length")
    .max(50, "Max length"),
  password: yup
    .string("Enter Your password")
    .min(2, "Min length")
    .max(50, "Max length")
});

function Profile() {
  const [page, setPage] = useState(0);
  const [blog, setblog] = useState([]);
  const [data, setdata] = useState("");
  const [user, setuser] = useState("");
  const [update, setupdate] = useState();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(Date.now());
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState('');
  const [image, setimage] = useState("");
  const [follow, setfollow] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);


  const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = ` ${token}`;

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    // textAlign: 'center',
    fontSize: "20px",
    margin: "10px",
    // color: theme.palette.text.secondary,
  }));

  const handleClickOpen = () => {
    setOpen(true);
    setFieldValue("userName", user.userName);
    setFieldValue("age", user.age);
    setFieldValue("mobileNo", user.mobileNo);
    setSelectedValue(user.gender);
  };
  const handleClose = () => {
    setOpen(false);
    setupdate();
  };

  const uploadfile = (e) => {
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`http://localhost:3000/api/upload-image`, formData)
      .then((res) => {
        setimage(res.data.data);
        // return setvalue(res.data);
      });
  };

  const getfollowing = () => {
    axios.get('http://localhost:3000/api/follow/following')
      .then((res) => {
        setfollow(res.data.data[0]);
      })
  };

  const allfollowingshow = () => {
    const alldata = follow.followedUsers;
    console.log(alldata, "alldata");
    navigate('/allfollowingshow');
  }

  const getusers = () => {
    axios.get('http://localhost:3000/api/profile')
      .then((res) => {
        setuser(res.data.data);
      })
  };

  useEffect(() => {

    getusers();
    getfollowing();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Error', error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  const { mutateAsync: updatestate } = useMutation(async (value) => {

    await axios
      .put(`http://localhost:3000/api/update-profile`, value)
      .then((res) => {
        if ({ res: true }) {
          enqueueSnackbar(
            "update user Successfully",
            { variant: "success" },
            { autoHideDuration: 1000 }
          );
          handleClose();
          setupdate();
          getusers();

        }
      })
      .catch((error) => {
        if (error.response.status === 422) {
          console.log("axios error");
          enqueueSnackbar(
            "This state already added",
            { variant: "error" },
            { autoHideDuration: 1000 }
          );
        }
      });
  });

  const formik = useFormik({
    initialValues: {
      image: "",
      userName: "",
      age: "",
      mobileNo: "",
      gender: "",
      address: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await updatestate({
        image: image,
        userName: values.userName,
        age: values.age,
        mobileNo: values.mobileNo,
        gender: selectedValue,
        address: coordinates
      });
    },
  });
  const { handleChange, handleSubmit, setFieldValue } = formik;

  const deletedaccount = () => {
    setLoading(true);
    console.log(loading,"loading");
    try{

      axios
        .post(`http://localhost:3000/api/auth/forget-password`)
        .then((res) => {
          setLoading(false);
          navigate('/verificationotp', { state: "Profile" });
        })
      }catch(e){
        console.log(e);
        setLoading(false);
      }
    

  }




  return (
    <div>
      <Container >
        <Grid container spacing={2} style={{ border: "1px solid black", margin: "10px 0 ", borderRadius: "15px", padding: "5px" }}>

          <Grid xs={12} style={{ textAlign: "center" }}>
            <h1>Profile</h1>
          </Grid>
          <Grid item xs={4}>
            <div><img src={"http://localhost:3000/" + user.image} width="100%" height="30%" alt="" srcset="" /></div>
            <div style={{ textAlign: "center", width: "100%", marginTop: 3 }}>
              <div>
                <div>
                  <Button
                    style={{
                      backgroundColor: "#1876d2",
                      color: "#fdfdfe",
                      // margin: "5px 0 5px 80%",
                    }}
                    variant="outlined"
                    onClick={handleClickOpen}
                  >
                    Update Profile
                  </Button>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">Update Profile</DialogTitle>
                    <DialogContent>
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
                                id="image"
                                name="image"
                                type="File"
                                accept="*/image"
                                onChange={(e) => uploadfile(e)}
                                error={
                                  formik.touched.image && Boolean(formik.errors.image)
                                }
                                helperText={formik.touched.image && formik.errors.image}
                              />
                            </Grid>

                            <Grid xs={6} mb={1}>
                              <TextField
                                fullWidth
                                id="userName"
                                name="userName"
                                label="UserName"
                                value={formik.values.userName || blog.userName}
                                onChange={handleChange}
                                error={
                                  formik.touched.userName && Boolean(formik.errors.userName)
                                }
                                helperText={
                                  formik.touched.userName && formik.errors.userName
                                }
                              />
                            </Grid>
                            <Grid xs={6} mb={1}>
                              <TextField
                                fullWidth
                                id="age"
                                name="age"
                                label="Age"
                                value={formik.values.age || blog.age}
                                onChange={handleChange}
                                error={formik.touched.age && Boolean(formik.errors.age)}
                                helperText={formik.touched.age && formik.errors.age}
                              />
                            </Grid>
                            <Grid xs={6} mb={1} >
                              <TextField
                                fullWidth
                                id="mobileNo"
                                name="mobileNo"
                                label="MobileNo"
                                value={formik.values.mobileNo || blog.mobileNo}
                                onChange={handleChange}
                                error={
                                  formik.touched.mobileNo && Boolean(formik.errors.mobileNo)
                                }
                                helperText={
                                  formik.touched.mobileNo && formik.errors.mobileNo
                                }
                              />
                            </Grid>
                            <Grid xs={6} mb={1}>
                              <div>
                                Latitude: {coordinates.lat}
                              </div><div>
                                Longitude: {coordinates.lng}
                              </div>
                            </Grid>
                            <Grid xs={6}>
                              Gender :
                              <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                value={selectedValue}
                                onChange={(event) => {
                                  setSelectedValue(event.target.value);
                                }}
                                name="radio-buttons-group"
                              >
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                              </RadioGroup>
                            </Grid>


                            <Grid xs={6}>
                              <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                fullWidth
                              >
                                Update
                              </Button>
                            </Grid>
                          </Grid>
                        </form>
                      </Typography>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={8} >
            <div style={{ textAlign: "right" }}>
              <Button
                variant='contained'
                color="error"
                disabled={loading}
                onClick={deletedaccount}>
               <span style={{paddingRight:"5px"}}>Deleted Account </span>  
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress size={20} />
                  </div>
                )}
              </Button>
            </div>
            <div onClick={allfollowingshow} style={{ fontSize: "20px", textAlign: "center" }}>Following<br />{follow.followCount}</div>
            <Item> <FontAwesomeIcon icon={faUser} /> &nbsp; {user.userName}</Item>
            <Item><FontAwesomeIcon icon={faEnvelope} /> &nbsp;{user.email}</Item>
            {/* <Item>{user.gender}</Item> */}
            <Item><FontAwesomeIcon icon={faPhone} /> &nbsp; {user.mobileNo}</Item>
            {/* <Item>{user.age}</Item> */}
          </Grid>
        </Grid>



      </Container>
    </div>
  );
}

export default Profile;

