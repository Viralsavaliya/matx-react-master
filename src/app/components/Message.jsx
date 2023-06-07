import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import InputAdornment from '@mui/material/InputAdornment';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileWord } from '@fortawesome/free-solid-svg-icons';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faFilePowerpoint } from '@fortawesome/free-solid-svg-icons';
import {
    Container,
    Grid,
    Avatar,
    TextField,
    Button,
    Modal,
    Fade
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
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
    const [file, setFile] = useState('');
    const [image, setImage] = useState('');
    const fileInputRef = useRef(null);



    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = ` ${token}`;

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (event) => {
        const selectedFile = event.target.files[0];
        // console.log(selectedFile.name, "selectedFile");
        setFile(selectedFile)

        const formData = new FormData();
        formData.append('file', selectedFile);

        await axios
            .post(`http://localhost:3000/api/message/imageupload`, formData)
            .then((res) => {
                if ({ res: true }) {
                    // console.log(res.data.data, "res");
                    setImage(res.data.data)
                    // console.log(res.data.data, "res.data.data");
                    enqueueSnackbar(
                        "Post add Successfully",
                        { variant: "success" },
                        { autoHideDuration: 1000 }
                    );
                }
            })
    };

    useEffect(() => {
        if (loginuser._id) {
            setUserId(loginuser._id)
        }
    }, [loginuser])
    const sendmessage = () => {
        const newMessage = {
            senderId: userId,
            receiverId: selectuser._id,
            message: image ? image : messages,
            name: selectuser.userName,
            time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })
        };
        socket.emit("send_message", newMessage);
        setAllmessage((prevMessages) => [...prevMessages, newMessage]);
        // console.log(newMessage, "newMessage");

        setMessages("");
        setFile("")
        setImage("")
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
            // console.log(data, "reciver_data");
            setMessage(data);

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
                // console.log(data, "data");
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
                                style={{ objectFit: "cover", borderRadius: "50%", cursor: "pointer" }}
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
                                style={{ width: "90%", display: "flex", cursor: "pointer" }}>
                                <Avatar
                                    alt={user?.userName}
                                    src={user?.image ? `http://localhost:3000/${user?.image}` : <PersonIcon />}
                                    style={{ objectFit: "cover", borderRadius: "50%", margin: "3px 10px 15px 10px" }}
                                    sm={12}
                                    width="40"
                                    height="40"
                                    onClick={() => handleAvatarClick(user?.image)}
                                /><p >{user?.userName}</p>
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
                                style={{ objectFit: "cover", borderRadius: "50%", cursor: "pointer" }}
                                width="40"
                                height="40"
                                onClick={() => handleAvatarClick(selectuser?.image)}
                            /><p style={{ margin: "10px 15px" }}><b>{selectuser?.userName}</b></p>
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

                            {allmessage?.map((message,index) => {

                                const isSameDay = (date1, date2) => {
                                    const d1 = new Date(date1);
                                    const d2 = new Date(date2);
                                    return (
                                        d1.getFullYear() === d2.getFullYear() &&
                                        d1.getMonth() === d2.getMonth() &&
                                        d1.getDate() === d2.getDate()
                                    );
                                };

                                const formatDate = (date) => {
                                    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                                    return new Date(date).toLocaleDateString(undefined, options);
                                };

                                const previousMessage = allmessage[index - 1];
                                const previousDate = previousMessage?.createdAt;
                                const currentDate = message?.createdAt;
                                const showDaySeparator = previousDate && !isSameDay(previousDate, currentDate);


                                let time;
                                const createdAt = new Date(message.createdAt);

                                if (message.time) {
                                    time = message.time;
                                } else {
                                    time = createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
                                }

                                if (message?.senderId === userId && message?.receiverId === selectuser?._id) {
                                    {
                                        if (showDaySeparator) {
                                            return (<p style={{ textAlign: 'center', marginTop: '10px', color: 'gray' }}>
                                                {formatDate(currentDate)}
                                            </p>
                                            )
                                        }
                                    }
                                    if (message?.message?.startsWith("image")) {
                                        return (
                                            <div style={{ width: "100%", textAlign: "end" }}>
                                                <img
                                                    src={`http://localhost:3000/chat/${message?.message}`}
                                                    alt="Message Image"
                                                    style={{ textAlign: "end", width: "50%", height: "300px", objectFit: "cover" }}
                                                />
                                                <p style={{ textAlign: "end", fontSize: "12px", margin: "-5px 0 0 0" }}>{message.message}</p>
                                                <p style={{ textAlign: "end", fontSize: "12px" }}>{time}</p>
                                            </div>
                                        );
                                    } else if (message?.message?.startsWith("video")) {
                                        return (
                                            <div style={{ width: "100%", textAlign: "end" }}>
                                                <video
                                                    src={`http://localhost:3000/chat/${message?.message}`}
                                                    alt="Message Video"
                                                    style={{ width: "50%", height: "300px", objectFit: "cover" }}
                                                />
                                                <p style={{ textAlign: "end", fontSize: "12px", margin: "-5px 0 0 0" }}>{message.message}</p>
                                                <p style={{ textAlign: "end", fontSize: "12px" }}>{time}</p>
                                            </div>
                                        );
                                    } else if (message?.message?.startsWith("file")) {
                                        const fileExtension = message?.message.split(".").pop();
                                        if (fileExtension === "pdf") {
                                            return (
                                                <div style={{ width: "100%", textAlign: "end" }}>
                                                    <a
                                                        href={`http://localhost:3000/chat/${message?.message}`}
                                                        target="_blank"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: "90px", color: "red" }} />
                                                    </a>
                                                    <p style={{ textAlign: "end", fontSize: "12px", margin: "-2px 0 0 0" }}>{message.message}</p>
                                                    <p style={{ textAlign: "end", fontSize: "12px" }}>{time}</p>
                                                </div>
                                            );
                                        } else if (fileExtension === "ppt" || fileExtension === "pptx") {
                                            return (
                                                <div style={{ width: "100%", textAlign: "end" }}>
                                                    <a
                                                        href={`http://localhost:3000/chat/${message?.message}`}
                                                        target="_blank"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePowerpoint} style={{ fontSize: "90px", color: "blue" }} />
                                                    </a>
                                                    <p style={{ textAlign: "end", fontSize: "12px", margin: "-2px 0 0 0" }}>{message.message}</p>
                                                    <p style={{ textAlign: "end", fontSize: "12px" }}>{time}</p>
                                                </div>
                                            );
                                        }
                                        else if (fileExtension === "doc" || fileExtension === "docx") {
                                            return (
                                                <div style={{ width: "100%", textAlign: "end" }}>
                                                    <a
                                                        href={`http://localhost:3000/chat/${message?.message}`}
                                                        target="_blank"
                                                    >
                                                        <FontAwesomeIcon icon={faFileWord} style={{ fontSize: "90px", color: "blue" }} />
                                                    </a>
                                                    <p style={{ textAlign: "end", fontSize: "12px", margin: "-2px 0 0 0" }}>{message.message}</p>
                                                    <p style={{ textAlign: "end", fontSize: "12px", objectFit: "contain" }}>{time}</p>
                                                </div>
                                            );
                                        }
                                    } else {
                                        return (
                                            <div>
                                                <p style={{ textAlign: "end", marginRight: "5px" }}>{message?.message}</p>
                                                <p style={{ textAlign: "end", fontSize: "12px" }}>{time}</p>
                                            </div>
                                        );
                                    }
                                }

                                if (message?.senderId === selectuser?._id && message?.receiverId === userId) {
                                    {
                                        if (showDaySeparator) {
                                            return (<p style={{ textAlign: 'center', marginTop: '10px', color: 'gray' }}>
                                                {formatDate(currentDate)}
                                            </p>
                                            )
                                        }
                                    }
                                    if (message?.message?.startsWith("image")) {
                                        return (
                                            <div>
                                                <img
                                                    src={`http://localhost:3000/chat/${message?.message}`}
                                                    alt="Message Image"
                                                    style={{ width: "50%", height: "300px", objectFit: "cover", marginLeft: "5px" }}
                                                />
                                                <p style={{ textAlign: "left", fontSize: "12px" }}>{time}</p>
                                            </div>
                                        );
                                    } else if (message?.message?.startsWith("video")) {
                                        return (
                                            <div>
                                                <video
                                                    src={`http://localhost:3000/chat/${message?.message}`}
                                                    alt="Message Video"
                                                    style={{ width: "50%", height: "300px", objectFit: "cover", marginLeft: "5px" }}
                                                />
                                                <p style={{ textAlign: "left", fontSize: "12px" }}>{time}</p>
                                            </div>
                                        );
                                    } else if (message?.message?.startsWith("file")) {
                                        const fileExtension = message?.message.split(".").pop();
                                        if (fileExtension === "pdf") {
                                            return (
                                                <div>
                                                    <a
                                                        href={`http://localhost:3000/chat/${message?.message}`}
                                                        target="_blank"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: "90px", color: "red" }} />
                                                    </a>
                                                    <p style={{ textAlign: "left", fontSize: "12px", margin: "-2px 0 0 0" }}>{message.message}</p>
                                                    <p style={{ textAlign: "left", fontSize: "12px" }}>{time}</p>
                                                </div>
                                            );
                                        } else if (fileExtension === "ppt" || fileExtension === "pptx") {
                                            return (
                                                <div>
                                                    <a
                                                        href={`http://localhost:3000/chat/${message?.message}`}
                                                        target="_blank"
                                                    >
                                                        <FontAwesomeIcon icon={faFilePowerpoint} style={{ fontSize: "90px", color: "blue" }} />
                                                    </a>
                                                    <p style={{ textAlign: "left", fontSize: "12px", margin: "-2px 0 0 0" }}>{message.message}</p>
                                                    <p style={{ textAlign: "left", fontSize: "12px" }}>{time}</p>
                                                </div>
                                            );
                                        }
                                        else if (fileExtension === "doc" || fileExtension === "docx") {
                                            return (
                                                <div >
                                                    <a
                                                        href={`http://localhost:3000/chat/${message?.message}`}
                                                        target="_blank"
                                                    >
                                                        <FontAwesomeIcon icon={faFileWord} style={{ fontSize: "90px", color: "blue" }} />
                                                    </a>
                                                    <p style={{ textAlign: "left", fontSize: "12px", margin: "-2px 0 0 0" }}>{message.message}</p>
                                                    <p style={{ textAlign: "left", fontSize: "12px", objectFit: "contain" }}>{time}</p>
                                                </div>
                                            );
                                        }
                                    } else {
                                        return (
                                            <div>
                                                <p style={{ textAlign: "left", marginLeft: "5px" }}>{message?.message}</p>
                                                <p style={{ textAlign: "left", fontSize: "12px" }}>{time}</p>
                                            </div>
                                        );
                                    }
                                }

                                return null;
                            })}



                            {String(Message.message)?.startsWith("image") ? (

                                <div>
                                    <img
                                        src={`http://localhost:3000/chat/${Message?.message}`}
                                        alt="Message Image"
                                        style={{ width: "50%", height: "300px", objectFit: "cover", marginLeft: "5px" }}
                                    />
                                    <p style={{ textAlign: "left", fontSize: "12px" }}>{Message?.time}</p>
                                </div>
                            ) : String(Message.message)?.startsWith("video") ? (
                                <div>
                                    <video
                                        src={`http://localhost:3000/chat/${Message?.message}`}
                                        alt="Message Video"
                                        style={{ width: "50%", height: "300px", objectFit: "cover", marginLeft: "5px" }}
                                    />
                                    <p style={{ textAlign: "left", fontSize: "12px" }}>{Message?.time}</p>
                                </div>
                            ) : String(Message.message)?.startsWith("file") ? (
                                <div>
                                    {Message.message.endsWith(".pdf") ? (
                                        <div>
                                            <a
                                                href={`http://localhost:3000/chat/${Message?.message}`}
                                                target="_blank"
                                            >
                                                <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: "90px", color: "red" }} />
                                            </a>
                                            <p style={{ textAlign: "left", fontSize: "12px", margin: "-2px 0 0 0" }}>{Message.message}</p>
                                            <p style={{ textAlign: "left", fontSize: "12px" }}>{Message.time}</p>
                                        </div>
                                    ) : (Message.message.endsWith(".ppt") || Message.message.endsWith(".pptx")) ? (
                                        <div>
                                            <a
                                                href={`http://localhost:3000/chat/${Message?.message}`}
                                                target="_blank"
                                            >
                                                <FontAwesomeIcon icon={faFilePowerpoint} style={{ fontSize: "90px", color: "blue" }} />
                                            </a>
                                            <p style={{ textAlign: "left", fontSize: "12px", margin: "-2px 0 0 0" }}>{Message.message}</p>
                                            <p style={{ textAlign: "left", fontSize: "12px" }}>{Message.time}</p>
                                        </div>
                                    ) :
                                        (Message.message.endsWith(".doc") || Message.message.endsWith(".docxx")) ? (
                                            <div >
                                                <a
                                                    href={`http://localhost:3000/chat/${Message?.message}`}
                                                    target="_blank"
                                                >
                                                    <FontAwesomeIcon icon={faFileWord} style={{ fontSize: "90px", color: "blue" }} />
                                                </a>
                                                <p style={{ textAlign: "left", fontSize: "12px", margin: "-2px 0 0 0" }}>{Message.message}</p>
                                                <p style={{ textAlign: "left", fontSize: "12px", objectFit: "contain" }}>{Message.time}</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <i className="fa fa-file-o" aria-hidden="true"></i>
                                                <p style={{ textAlign: "left", marginLeft: "5px" }}>{Message?.message}</p>
                                            </div>
                                        )}
                                </div>
                            ) : (
                                <div>
                                    <p style={{ textAlign: "left", marginLeft: "5px" }}>{Message?.message}</p>
                                    <p style={{ textAlign: "left", fontSize: "12px" }}>{Message.time}</p>
                                </div>
                            )}

                        </Grid>
                        <Grid container xs={12} md={12}>
                            <Grid xs={12} md={11}>
                                <TextField
                                    fullWidth
                                    type="text"
                                    value={image ? image : messages}
                                    placeholder={'Your message'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FileUploadIcon onClick={handleButtonClick} style={{ cursor: "pointer" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    onChange={(e) => setMessages(e.target.value)}
                                />
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    ref={fileInputRef}
                                    onChange={handleFileChange}

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
