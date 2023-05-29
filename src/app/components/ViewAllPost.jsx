import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';

import {
  Button,
  Grid,
  Container,
  TextField,
  styled,
  Paper,
  Input
} from "@mui/material";

import axios from "axios";
import jwt_decode from "jwt-decode";

import { useFormik } from "formik";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState, useRef } from "react";
import { useMutation } from "react-query";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";

function ViewAllPost() {
  const [post, setPost] = useState([]);
  const [comment, setComment] = useState(null);
  const [user, setuser] = useState('')
  const [currPage, setCurrPage] = useState(1); // storing current page number
  const [prevPage, setPrevPage] = useState(0); // storing prev page number
  const [userList, setUserList] = useState([]); // storing list
  const [lastList, setLastList] = useState(false);// setting a flag to know the last list

  const listInnerRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `http://localhost:3000/api/post?page=${currPage}`
      );
      console.log(response.data.data, "<<<");
      setPost(response.data.data)
      if (!response.data.pagination.totalPosts) {
        setLastList(true);
        return;
      }
      setPrevPage(currPage);
      setUserList([...userList, ...response.data.data]);
    };
    if (!lastList && prevPage !== currPage) {
      fetchData();
    }
  }, [currPage, lastList, prevPage, userList]);

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };





  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;

    if (token) {
      axios.get(`http://localhost:3000/api/profile`)
        .then((response) => {
          const user = response.data.data;
          setuser(user);
          console.log("User Details:", user);
        })

    }
  }, []);



  const handleLike = (user) => {
    if (!user.isLikedByUser) {
      axios
        .post(`http://localhost:3000/api/like`, { postid: user._id })
        .then((res) => {
          console.log(res.data.data);
          user.isLikedByUser = true;
          user.likescount += 1;
          setPost((prevPosts) => {
            return prevPosts.map((p) => (p._id === user._id ? user : p));
          });
        })
        .catch((error) => {
          console.log("Error liking post:", error);
        });
    } else {
      axios
        .delete(`http://localhost:3000/api/like?postid=${user._id}`)
        .then((res) => {
          console.log(res.data.data);
          user.isLikedByUser = false;
          user.likescount -= 1;
          setPost((prevPosts) => {
            return prevPosts.map((p) => (p._id === user._id ? user : p));
          });
        })
        .catch((error) => {
          console.log("Error unliking post:", error);
        });
    }
  };
  // useEffect(() => {
  //   getallpost();
  // }, [currentPage]);




  const commentMutation = useMutation((commentData) =>
    axios.post("http://localhost:3000/api/comment", commentData)
  );

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const commentData = {
        postid: postId,
        comment: comment,
        userName: user.userName,
        image: user.image
      };

      await commentMutation.mutateAsync(commentData);

      setPost((prevPosts) => {
        return prevPosts.map((p) => {
          if (p._id === postId) {
            const updatedComments = [...p.comments, commentData];
            console.log({ ...p, comments: updatedComments }, "ghhjghjghjghj");
            return { ...p, comments: updatedComments };
          }
          return p;
        });
      });
      setComment("");
      // getallpost();
      console.log(post, "post");
    } catch (error) {
      console.log(error);
    }
  };

  // const getallpost = () => {
  //   axios.get(`http://localhost:3000/api/post?page=${currentPage}`)
  //     .then((res) => {
  //       setPost((prevPosts) => [...prevPosts, ...res.data.data]);

  //       if (res.data.data.length === 0) {
  //         setHasMore(false);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log("Error fetching posts:", error);
  //     });
  // };



  const handleToggleComments = (postId) => {
    console.log("call this function to toggle comments")
    setPost((prevPosts) => {
      return prevPosts.map((p) => {
        if (p._id === postId) {
          return { ...p, showComments: !p.showComments };
        }
        return p;
      });
    });
  };

  return (
    <div>
      <Container>
        <Grid
          onScroll={onScroll}
          ref={listInnerRef}
          container 
          spacing={2} 
          style={{ border: "1px solid black", margin: "10px 0 ", borderRadius: "15px", padding: "5px" ,  height: "100vh", overflowY: "auto" }}>
          <Grid xs={12} style={{ textAlign: "center" }}>
            <h1>View Post</h1>
          </Grid>
          {userList?.map((user) => (
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              xs={12}>
              <Grid

                md={7}
                sm={12}
                border="1px solid gray"
                style={{ borderRadius: "20px", marginBottom: "15px" }}>
                <Grid xs={12}>

                  <img src={"http://localhost:3000/" + user?.userimage}
                    style={{ objectFit: "cover", borderRadius: "50%", margin: " 10px 0 -15px 10px" }}
                    sm={12}
                    width="40"
                    height="40"
                    alt=""
                    srcset="" />
                  <span style={{ margin: " 25px 0 25px 15px" }}>
                    {user?.userName}
                  </span>

                </Grid >
                <Grid xs={12} sm={12}>
                  <img xs={12} sm={12} src={"http://localhost:3000/" + user?.image}
                    style={{ margin: "15px 0 0 0" }}
                    width="100%"
                    height="400px"
                    alt=""
                    srcset="" />
                </Grid>
                <Grid xs={12} md={12}>

                  <Grid>
                    <FontAwesomeIcon
                      onClick={() => handleLike(user)}
                      style={{ color: user?.isLikedByUser == true ? 'red' : 'black', cursor: 'pointer', margin: " 0px 0 0px 10px" }}
                      icon={faHeart}
                    />&nbsp;
                    {user?.likescount} &nbsp;&nbsp;
                    <FontAwesomeIcon
                      icon={faComment}
                      style={{ color: user?.showComments == true ? 'black' : 'gray', cursor: 'pointer' }}
                      onClick={() => handleToggleComments(user._id)} />
                  </Grid>
                  {user.showComments && (
                    <div>
                      <Grid xs={12} container marginBottom={1} marginLeft='10px'>
                        <Grid item xs={11} md={9}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            label="Comment"
                            value={comment}
                            onChange={handleCommentChange}
                          />

                        </Grid>
                        <Grid item xs={11} md={2}>
                          <Button
                            style={{ padding: "14px 0" }}
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => handleCommentSubmit(user._id)}
                          >
                            Add Comment
                          </Button>
                        </Grid>
                      </Grid>
                      {user?.comments.map((com) => (
                        <div style={{ margin: " 0 0 0 10px" }}>
                          <span>
                            <img
                              src={"http://localhost:3000/" + com?.image}
                              style={{ objectFit: "cover", borderRadius: "50%", margin: " 0 5px -8px 0" }}
                              sm={12}
                              width="30"
                              height="30"
                              alt=""
                              srcset="" />
                            {com?.userName}
                          </span><br />
                          <span
                            style={{ paddingLeft: "35px" }}>
                            {com?.comment}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}


                  <h3 style={{ margin: "30px 0 0 10px" }}>{user?.title}</h3>

                  <p style={{ margin: "-15px 0 0px 10px" }} dangerouslySetInnerHTML={{ __html: user.discripation }} />

                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
}

export default ViewAllPost;
