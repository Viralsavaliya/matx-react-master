import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
    Container,
    Grid,
    Avatar,

} from "@mui/material";

import PersonIcon from '@mui/icons-material/Person';

const socket = io('http://localhost:3000');

function Message() {
    const [messages, setMessages] = useState([]);
    const [users, setusers] = useState([]);
    const [loginuser, setloginuser] = useState({});

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;

    const sendmessage = () => {
        socket.emit("send_message", { message: "Hello, world!" });
    }

    useEffect(() => {
        socket.on("recive_message", (data) => {
            alert(data.message);
        })
        alluser();
    }, [socket])



    const alluser = () => {
        axios.get(`http://localhost:3000/api/message/chatpage`)
            .then((response) => {
                const user = response.data.users;
                const logInUser = response.data.logInUser;
                setusers(user);
                setloginuser(logInUser);
            })
    }

    const messageuser = (row) => {
        console.log(row, "userfound");
    }


    return (
        <div>
            <Container style={{ border: "2px solid black", padding: "2px" }}>
                <Grid container xs={12}>
                    <Grid xs={12}>
                        <Grid
                            xs={12} md={12}
                            key={loginuser?.id}
                            style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                            <Avatar
                                alt={loginuser?.userName}
                                src={loginuser?.image ? `http://localhost:3000/${loginuser?.image}` : <PersonIcon />}
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                width="40"
                                height="40"
                            /><p style={{ margin: "10px 15px" }}>{loginuser?.userName}</p>
                        </Grid>
                    </Grid>
                    <Grid xs={12} md={3} style={{ border: "2px solid red", marginBottom: "15px" }}>
                        {users.map((user) => (
                            <Grid
                                xs={8}
                                md={10}
                                key={user?.id}
                                onClick={() => messageuser(user)}
                                style={{ width: "90%", display: "flex" }}>
                                <Avatar
                                    alt={user?.userName}
                                    src={user?.image ? `http://localhost:3000/${user?.image}` : <PersonIcon />}
                                    style={{ objectFit: "cover", borderRadius: "50%", margin: "3px 10px 15px 10px" }}
                                    sm={12}
                                    width="40"
                                    height="40"
                                /><p>{user?.userName}</p>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid xs={12} md={9} style={{ border: "2px solid blue" }}>
                        <input
                            type="text"
                            //   value={inputValue}
                            placeholder='Your message'
                        //   onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button onClick={sendmessage}>Send</button>
                    </Grid>
                </Grid>
            </Container>
        </div>


    );
}

export default Message;
