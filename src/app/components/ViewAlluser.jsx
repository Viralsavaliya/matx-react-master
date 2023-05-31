import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {
    Grid,
    Container,
    Button,

} from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';


function ViewAlluser() {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;
    const [user, setuser] = useState([]);
    const [request, setrequest] = useState([]);
    const alluser = () => {
        setuser([])
        axios.get(`http://localhost:3000/api/follow/followuser`)
        .then((response) => {
            const user = response.data.data;
            setuser(user);
            })
    }
  
    const sendrequest = (id) => {
        console.log(id);
        axios.post(`http://localhost:3000/api/follow?followerId=${id}`)
            .then((response) => {
                // console.log(response);
                alluser()
            })
    }
    useEffect(() => {
        alluser();
    }, [])

    return (
        <div>
            <Container>
                <Grid container>
                    <Grid xs={12} style={{ textAlign: "center" }}>
                        <h1>View All User</h1>
                    </Grid>
                    <Grid xs={12} style={{ textAlign: "left" }}>
                        <Grid xs={6} md={12} style={{ border: "2px solid black" }}>
                            {user?.map((data) => (
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
                                    <Grid xs={2} md={2} style={{ textAlign: "center" }}>
                                        <Button

                                            onClick={() => data?.followStatus === null ? sendrequest(data?._id): null   }
                                            style={{ textAlign: "right" }}
                                            variant={data?.followStatus === 0 ? "outlined" : data?.followStatus === 1 ? "contained" : data?.followStatus === 2 ? "outlined" : "contained"}
                                            color={data?.followStatus === 0 ? "secondary" : data?.followStatus === 1 ? "success" : data?.followStatus === 2 ? "error" : "primary"}
                                        >
                                            {data?.followStatus === 0
                                                ? "Request"
                                                : data?.followStatus === 1
                                                    ? "Accepted"
                                                    : data?.followStatus === 2
                                                        ? "Rejected"
                                                        : "Follow"}
                                        </Button>
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
export default ViewAlluser;