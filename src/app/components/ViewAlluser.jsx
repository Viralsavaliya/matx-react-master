import React from "react";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import {
    Grid,
    Container,
    Button,
    TextField,
    Avatar
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';

function ViewAlluser() {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;
    const [user, setuser] = useState([]);
    const [search, setsearch] = useState([]);
    const alluser = () => {
        setuser([])
        axios.get(`http://localhost:3000/api/follow/followuser/?search=${search}`)
            .then((response) => {
                const user = response.data.data;
                setuser(user);
            })
    }

    const sendrequest = (id) => {
        // console.log(id);
        axios.post(`http://localhost:3000/api/follow?followerId=${id}`)
            .then((response) => {
                // console.log(response);
                alluser()
            })
    }
    useEffect(() => {
        alluser();
    }, [search])

    return (
        <div>
            <Container>
                <Grid container>
                    <Grid xs={12} style={{ textAlign: "center" }}>
                        <h1>View All User</h1>
                    </Grid>
                    <Grid item xs={11} md={12} style={{ textAlign: "end" }} >
                        <TextField
                            style={{ margin: "10px 0 10px 0px", width:"20%" , alignItems: "right" }}
                            fullWidth
                            variant="outlined"
                            label="Search"
                            value={search}
                            onChange={(e) => setsearch(e.target.value)}
                        />

                    </Grid>
                    <Grid xs={12} style={{ textAlign: "left" }}>
                        <Grid xs={6} md={12} >
                            {user?.map((data) => (
                                <Grid xs={10} md={12} style={{ margin: "10px 0", display: "flex" }}>
                                    <Grid xs={8} md={10} key={data?.id} style={{ width: "90%" , display:"flex" }}>
                                    <Avatar
                                            alt={data.userName}
                                            src={data.image ? `http://localhost:3000/${data?.image}` : <PersonIcon />}
                                            style={{ objectFit: "cover", borderRadius: "50%", margin: "3px 10px 15px 10px" }}
                                            sm={12}
                                            width="40"
                                            height="40"
                                        /><p>{data?.userName}</p>
                                    </Grid>
                                    <Grid xs={2} md={2} style={{ textAlign: "center" }}>
                                        <Button

                                            onClick={() => data?.followStatus === null ? sendrequest(data?._id) : null}
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