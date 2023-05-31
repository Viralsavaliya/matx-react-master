import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
    Grid,
    Container,
    Button,

} from "@mui/material";
import axios from "axios";
import { Navigate, useLocation, useNavigate } from "react-router-dom";


function AllFollowingshow(props) {
    const [user, setuser] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        getfollowing()
    }, []);
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;

    const getfollowing = () => {
        axios.get('http://localhost:3000/api/follow/following')
            .then((res) => {
                setuser(res.data.data[0]);
                // console.log(res.data.data[0].followedUsers);
            })
    };

    const unfollow = (data) => {
        console.log("row", data);
        axios.delete(`http://localhost:3000/api/follow?id=${data}`)
            .then((res) => {
                // console.log(res);
                getfollowing();
            })
    }
    const backtopage = () => {
        navigate('/profile  ');
      }


    return (
        <div>
            <Container>
                <Grid xs={12} style={{ textAlign: "end" }}>
                    <Button
                        style={{ margin: "10px 0 0 0px", width: "80px", alignItems: "right" }}
                        color="primary"
                        variant="contained"
                        type="submit"
                        onClick={() => backtopage()}
                    >
                        Back
                    </Button>
                </Grid>
                <Grid container>
                    <Grid xs={12} style={{ textAlign: "center" }}>
                        <h1>Following User</h1>
                    </Grid>
                    <Grid xs={12} style={{ textAlign: "left" }}>
                        <Grid xs={6} md={12} style={{ border: "2px solid black" }}>
                            {user.followedUsers?.map((data) => (
                                <Grid xs={10} md={12} style={{ margin: "10px 0", display: "flex" }}>
                                    <Grid xs={8} md={10} key={data?.id} style={{ width: "90%" }}>
                                        <img src={"http://localhost:3000/" + data?.image}
                                            style={{ objectFit: "cover", borderRadius: "50%", margin: " 10px 10px -15px 10px" }}
                                            sm={12}
                                            width="40"
                                            height="40"
                                            alt=""
                                            srcset="" />
                                        {data?.userName}
                                    </Grid>
                                    <Grid >
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => unfollow(data._id)}>Unfollow</Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    )
}

export default AllFollowingshow;