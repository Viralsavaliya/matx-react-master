import axios from 'axios';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import {
    Container,
    Grid,
    Avatar,
    TextField,
    Button,
    Modal,
    Backdrop,
    Fade
} from "@mui/material";

import PersonIcon from '@mui/icons-material/Person';




function Message() {
    const [messages, setMessages] = useState([]);
    const [users, setusers] = useState([]);
    const [loginuser, setloginuser] = useState({});
    const [userId, setUserId] = useState();
    const [selectuser, setselectuser] = useState('');
    const [socket, setSocket] = useState('');
    const [connected, setConnected] = useState('');
    const [allmessage, setAllmessage] = useState([]);
    const [Message, setMessage] = useState([]);
    const [open, setOpen] = useState(false);
    const [popupImage, setPopupImage] = useState('');

    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;

    useEffect(() => {
        if (loginuser._id) {
            console.log(loginuser._id, "loginuser._id");
            setUserId(loginuser._id)
        }
    }, [loginuser])
    const sendmessage = () => {

        const newMessage = {
            senderId: userId,
            receiverId: selectuser._id,
            message: messages,
            name: selectuser.userName
        };
        socket.emit("send_message", newMessage);
        setAllmessage((prevMessages) => [...prevMessages, newMessage]);
        setMessages("");
    }
    useEffect(() => {
        const socket = io('http://localhost:3000', {
            query: {
                user_id: userId,
                password: "password1"
            }
        });
        if (!socket.connected) {
            socket.connect();
        }
        socket.on("connect", function () {
            setConnected(true)
        })
        setSocket(socket)
        socket.emit('join', {
            userId: userId
        })

        socket.on("recive_message", (data) => {
            console.log(data, "reciver_data");
            setMessage(data?.message);
            // setAllmessage((prevMessages) => [...prevMessages, data?.message]);

        })

        alluser()
    }, [userId])
    useEffect(() => {

        if (socket) {
            socket.emit("getMessages", {
                senderId: userId,
                receiverId: selectuser._id
            })
            socket.on("allMessages", (data) => {
                setAllmessage(data)
            })
        }

    }, [selectuser])
    useEffect(() => {
        setAllmessage([""]);
    }, [selectuser])


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
        setselectuser(row);
    }

    const handleAvatarClick = (imageUrl) => {
        setPopupImage(imageUrl);
        setOpen(true);
    };

    
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
                                onClick={() => handleAvatarClick(loginuser?.image)}
                            />
                            <p style={{ margin: "10px 15px" }}>{loginuser?.userName}</p>
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
                                    onClick={() => handleAvatarClick(user?.image)}
                                /><p>{user?.userName}</p>
                            </Grid>
                        ))}
                    </Grid>
                    <Grid xs={12} md={9} style={{ border: "2px solid blue" }}>
                        <Grid
                            xs={12} md={12}
                            key={selectuser?.id}
                            style={{ width: "100%", display: "flex" }}>
                            <Avatar
                                alt={selectuser?.userName}
                                src={selectuser?.image ? `http://localhost:3000/${selectuser?.image}` : <PersonIcon />}
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                width="40"
                                height="40"
                                onClick={() => handleAvatarClick(selectuser?.image)}
                            /><p style={{ margin: "10px 15px" }}>{selectuser?.userName}</p>
                        </Grid>
                        <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                        >
                            <Fade in={open}>
                                <div style={{ textAlign: "center", margin: "12% 28%", backgroundColor: "#000" }}>
                                    {popupImage ?
                                        <img src={`http://localhost:3000/${popupImage}`}
                                            alt="Popup" style={{ Width: "100%", height: "50vh" }} />
                                        :
                                        <PersonIcon style={{ fontSize: "280px" }} />
                                    }
                                </div>
                            </Fade>
                        </Modal>
                        <Grid xs={12} md={12} style={{ height: "70vh", overflowY: 'auto' }}>
                            {allmessage?.map((message) => {
                                if (message?.senderId === userId && message?.receiverId === selectuser?._id) {
                                    return <p style={{ textAlign: "right" }}>{message?.message}</p>;
                                }
                                if (message?.senderId === selectuser?._id && message?.receiverId === userId) {
                                    return <p style={{ textAlign: "left" }}>{message?.message}</p>;
                                }
                                return null;
                            })}
                            <p style={{ textAlign: "left" }}>{Message}</p>
                        </Grid>
                        <Grid container xs={12} md={12}>
                            <Grid xs={12} md={11}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    value={messages}
                                    placeholder='Your message'
                                    onChange={(e) => setMessages(e.target.value)}
                                />
                            </Grid>
                            <Grid xs={12} md={1}>
                                <Button variant="contained" style={{ padding: "14px 19px" }} onClick={sendmessage}>Send</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>


            </Container>
        </div>


    );
}

export default Message;
