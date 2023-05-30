import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import {
    Grid,
    Container,
    Button,

} from "@mui/material";
import { useLocation } from "react-router-dom";


function AllFollowingshow (props) {
    const location = useLocation("/profile");
    const [user, setuser] = useState([]);
    console.log(location.state,"location");
    // setuser(props)
    useEffect(() => {
            setuser(location.state);
        }, [location.state]);


    return (
        <div>
            <Container>
                <Grid container>
                    <Grid xs={12} style={{ textAlign: "center" }}>
                        <h1>Following User</h1>
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