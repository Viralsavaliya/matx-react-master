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


function Follow() {
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
    const allrequest = () => {
        setrequest([])
        axios.get(`http://localhost:3000/api/follow/allrequestoneuser`)
        .then((response) => {
            const request = response.data.data;
            setrequest(request);
            })
    }
    const rejectrequest = (row) => {
        console.log(row, 'row');
        axios.post(`http://localhost:3000/api/follow/rejectrequest?id=${row}`)
            .then((response) => {
                allrequest()
            })
    }
    const acceptrequest = (row) => {
        console.log(row, 'row');
        axios.post(`http://localhost:3000/api/follow/acceptrequest?id=${row}`)
            .then((response) => {
                allrequest()
            })
    }

    useEffect(() => {
        alluser();
        allrequest()
    }, [])

    return (
        <div>
            <Container>
                <Grid container>
                    <Grid xs={12} style={{ textAlign: "center" }}>
                        <h1>View All Request</h1>
                    </Grid>
                    <Grid xs={12} style={{ textAlign: "left" }}>
                        <Grid xs={6} md={12} >
                            {request?.map((data) => (
                                <Grid xs={10} md={12} style={{ margin: "10px 0", display: "flex" }}>
                                    <Grid xs={8} md={10} key={data?.id} style={{ width: "90%" }}>
                                        <img src={"http://localhost:3000/" + data?.userId?.image}
                                            style={{ objectFit: "cover", borderRadius: "50%", margin: " 10px 10px -15px 10px" }}
                                            sm={12}
                                            width="40"
                                            height="40"
                                            alt=""
                                            srcset="" />
                                        {data?.userId?.userName}
                                    </Grid>
                                    <Grid xs={2} md={2} style={{ textAlign: "center" }}>
                                        <div style={{ margin: "10px 0" }}>
                                            <FontAwesomeIcon icon={faCheckCircle} onClick={() => acceptrequest(data?._id)} style={{ fontSize: "25px" }} />
                                            <FontAwesomeIcon icon={faTimesCircle} onClick={() => rejectrequest(data?._id)} style={{ fontSize: "25px", marginLeft: "10px" }} />
                                        </div>
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

export default Follow;