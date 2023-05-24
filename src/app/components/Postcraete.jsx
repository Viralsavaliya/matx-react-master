 
  import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
  import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
  import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
  import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
  import { CKEditor } from "@ckeditor/ckeditor5-react";
  import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
  import moment from "moment";
  
  import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TextField,
    Typography,
  } from "@mui/material";
  
  import axios from "axios";
  import { useFormik } from "formik";
  import { enqueueSnackbar } from "notistack";
  import React, { useEffect, useState } from "react";
  import { useMutation } from "react-query";
  import * as yup from "yup";
  
  const validationSchema = yup.object({
    // title: yup
    //   .string("Enter Your Name")
    //   .min(2, "Min length")
    //   .max(50, "Max length")
    //   .required("title is Required"),
    // discripation: yup
    //   .string("Enter Your conatnt")
    //   .min(2, "Min length")
    //   .max(50, "Max length")
    //   .required("contant is Required"),
    // post_date: yup.string("Enter post Date").required("Date is Required"),
    // category_id: yup
    // .string("selected category is reqired")
    // .required("category is Required"),
  });
  
  function Postcreate() {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [blog, setblog] = useState([]);
    const [category, setcategory] = useState([]);
    const [update, setupdate] = useState();
    const [totalrecord, settotalrecord] = useState("");
    const [open, setOpen] = useState(false);
    const [data, setdata] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [image, setimage] = useState("");
    const [value, setValue] = useState(Date.now());
    const [con, setcon] = useState();
    const [isChecked, setIsChecked] = useState(false);
  
  
    const handleClickOpen = () => {
      setOpen(true);
      setdata("");
      setFieldValue("title", ""); 
      setcon("")
      setFieldValue("discripation", "");
    };
  
    const handleChangePage = (event, newPage) => {
      setPage(newPage ?? page);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    const handleClose = () => {
      setOpen(false);
      setupdate();
    };
  
    useEffect(() => {
      getuserpost()
    }, [update, open, page, rowsPerPage]);
  
    const handleClick = async (data) => {
      console.log("data", data);
      setdata(data.category_id?._id);
      setFieldValue("title", data.title);
      setcon(data.discripation);
      setupdate(data._id);
      // console.log(data._id);
      setOpen(true);
    };
  
 
    const handleDelete = async (data) => {
      if (update) {
        axios.delete(`http://localhost:3000/api/post/${update}`).then((res) => {
          if ({ res: true }) {
            setupdate();
            console.log("Blog Delete Successfully");
            enqueueSnackbar(
              "Post delete successfully",
              { variant: "success" },
              { autoHideDuration: 1000 }
            );
          }
        });
      }
      setIsDeleteDialogOpen(false);
    };

    const token = localStorage.getItem('token');
  axios.defaults.headers.common['Authorization'] = ` ${token}`;
  

    const getuserpost = () => {
      // console.log("api call")
      axios
        .get(`http://localhost:3000/api/post/oneuserpost`)
        .then((res) => {
          return setblog(res.data.data);
        });
    };


    
    
    const handleFileSelect = (e) => {
        console.log(e.target.files[0])
        setimage(e.target.files[0]);
      };
    const { mutateAsync: cratepost } = useMutation(async (value) => {
        console.log("value", value);
        const formData = new FormData();
        formData.append('file', image);
        formData.append('title', value.title);
        formData.append('discripation', value.discripation);
        console.log("data", formData);
      
      await axios
        .post(`http://localhost:3000/api/post`, formData)
        .then((res) => {
          if ({ res: true }) {
            console.log("post create Successfully");
            enqueueSnackbar(
              "Post add Successfully",
              { variant: "success" },
              { autoHideDuration: 1000 }
            );
            handleClose();
            setimage("");
            setcon("");
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            console.log("axios error");
            enqueueSnackbar(
              "This post already added",
              { variant: "error" },
              { autoHideDuration: 1000 }
            );
          }
        });
    });
    const { mutateAsync: updatestate } = useMutation(async (value) => {
      // console.log("value", value);
      // console.log("data",data)
      value.country_id = data;
      await axios
        .put(`http://localhost:3000/api/blog/${update}`, value)
        .then((res) => {
          if ({ res: true }) {
            //   console.log("blog update Successfully");
            enqueueSnackbar(
              "update post Successfully",
              { variant: "success" },
              { autoHideDuration: 1000 }
            );
            handleClose();
            setupdate();
            setimage("");
            setcon("");
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
        user_id: "",
        image: "",
        title: "",
        check: "",
        discripation: "",
      },
    //   validationSchema: validationSchema,
      onSubmit: async (values) => {
        //   console.log("update", update);
        if (update) {
          await updatestate({
            // category_id: values.category_id,
            image: image,
            title: values.title,
            discripation: con,
          });
        } else {
          await cratepost({
            // category_id: values.category_id,
            image: image,
            title: values.title,
            discripation: con,
          });
        }
      },
    });
    const { handleChange, handleSubmit, setFieldValue } = formik;
  
    const handleClickDelete = (data) => {
      setIsDeleteDialogOpen(true);
      setupdate(data._id);
    };
  
    const handleChangedrop = (data) => {
      console.log("datavalue", data);
      setdata(data);
    };
  
    return (
      <div>
        <div style={{ textAlign: "center", width: "100%" }}>
          <h1>Create Post</h1>
          <div>
            <Button
              style={{
                backgroundColor: "#1876d2",
                color: "#fdfdfe",
                margin: "5px 0 5px 80%",
              }}
              variant="outlined"
              onClick={handleClickOpen}
            >
              Add Post
            </Button>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Add Post</DialogTitle>
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
                          id="title"
                          name="title"
                          label="Title"
                          value={formik.values.title || blog.title}
                          onChange={handleChange}
                          error={
                            formik.touched.title && Boolean(formik.errors.title)
                          }
                          helperText={formik.touched.title && formik.errors.title}
                        />
                      </Grid>
                      <Grid xs={6} mb={1}>
                        <CKEditor
                          editor={ClassicEditor}
                          data={con}
                          onReady={(editor) => {
                            // You can store the "editor" and use when it is needed.
                            // console.log( 'Editor is ready to use!', editor );
                          }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            console.log("data", { data });
                            setcon(data);
                          }}
                          onBlur={(event, editor) => {
                            // console.log( 'Blur.', editor );
                          }}
                          onFocus={(event, editor) => {
                            // console.log( 'Focus.', editor );
                          }}
                        />
                      </Grid>
                      <Grid xs={6} mb={1}>
                        <TextField
                          fullWidth
                          id="image"
                          name="image"
                          type="File"
                          accept="*/image"
                          onChange={(e) => handleFileSelect(e)}
                          error={
                            formik.touched.image && Boolean(formik.errors.image)
                          }
                          helperText={formik.touched.image && formik.errors.image}
                        />
                      </Grid>
  
                      <Grid xs={6}>
                        <Button
                          color="primary"
                          variant="contained"
                          fullWidth
                          type="submit"
                        >
                          Add
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Typography>
              </DialogContent>
            </Dialog>
          </div>
        </div>
  
        <Table
          sx={{ minWidth: 650 }}
          style={{ border: "2px solid black" }}
          className="text-lg"
          aria-label="simple table"
        >
          <TableHead>
            <TableRow style={{ width: 100 }}>
              <TableCell
                style={{
                  fontSize: 22,
                  color: "rgb(38 28 26 / 87%)",
                }}
                align="left"
              >
                No.
              </TableCell>
              <TableCell
                style={{
                  fontSize: 22,
                  color: "rgb(38 28 26 / 87%)",
                }}
                align="left"
              >
                Image
              </TableCell>
              <TableCell
                style={{
                  fontSize: 22,
                  color: "rgb(38 28 26 / 87%)",
                }}
                align="left"
              >
                Title
              </TableCell>
              <TableCell
                style={{
                  fontSize: 22,
                  color: "rgb(38 28 26 / 87%)",
                }}
                align="left"
              >
                discripation
              </TableCell>
             
              <TableCell
                style={{
                  fontSize: 22,
                  color: "rgb(38 28 26 / 87%)",
                }}
                align="left"
              >
                Status
              </TableCell>
              <TableCell
                style={{
                  fontSize: 22,
                  color: "rgb(38 28 26 / 87%)",
                }}
                align="left"
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blog?.map((row, i) => (
              <TableRow
                style={{ border: "2px solid black" }}
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left" component="th" scope="row">
                  {i + 1}
                </TableCell>
                <TableCell align="left">
                  <img
                    src={"http://localhost:3000/" + row?.image}
                    height="70px"
                    width="150px"
                    alt=""
                    srcset=""
                  />
                </TableCell>
                <TableCell align="left">{row?.title}</TableCell>
                <TableCell align="left">
                  {" "}
                  <div dangerouslySetInnerHTML={{ __html: row?.discripation }} />
                </TableCell>
                <TableCell align="left">
                  {row?.status}
                </TableCell>
                <TableCell align="left" style={{ width: "230px" }}>
                  <Button
                    style={{ margin: "0 0 0 0px", width: "80px" }}
                    color="primary"
                    variant="contained"
                    type="submit"
                    onClick={() => handleClick(row)}
                  >
                    Update
                  </Button>
                  <Button
                    style={{ margin: "0 0 0 3px", width: "75px" }}
                    // startIcon={<DeleteIcon />}
                    color="secondary"
                    variant="contained"
                    type="submit"
                    onClick={() => handleClickDelete(row)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={totalrecord}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          open={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete confirmation</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsDeleteDialogOpen((row) => setupdate(row))}
            >
              Cancel
            </Button>
            <Button onClick={() => handleDelete()} color="secondary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  
  export default Postcreate;