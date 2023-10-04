import React, {useEffect, useState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import {AdaptivityProvider, AppRoot, ConfigProvider} from '@vkontakte/vkui';
import WheelComponent from "./components/Wheel";
import axios from "axios";
import Modal from "./components/Modal";

// static files
import '@vkontakte/vkui/dist/vkui.css';
import './assets/css/App.css'
import './assets/css/media.css';
import coins from "./assets/img/coins.png";

const App = () => {
    const instance = axios.create({
        baseURL: "http://localhost:4444",
        timeout: 5000,
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const [fetchedUser, setUser] = useState(null);
    const [spin, setSpin] = useState(false);
    const [users, setUsers] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [point, setPoint] = useState("");
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const promises = [
            bridge.send('VKWebAppGetUserInfo'),
            instance.get("/get-users"),
        ];

        Promise.all(promises)
            .then((r) => {
                const u = r.at(0);
                const us = r.at(1).data;
                setUser(u);
                setUsers(us);

                setCurrentUser(us.find(x => parseInt(x.vkId) === u.id));
            }).catch((e) => console.log(e));
    }, []);

    const handleSpinClick = () => {
        if (!spin) {
            setSpin(true);
            console.log("start");
        }
    };

    const handleJackpotClick = () => {
        if (!spin) {
            setSpin(true);

            instance.put(`/current-user/jackpot/${currentUser.vkId}`)
                .then((r) => console.log(r))
                .catch((e) => console.log(e));
        }
    };

    const handleSpinFinish = (text) => {
        setSpin(false);
        setPoint(text);
        setIsOpenModal(true);

        if (!fetchedUser) return;

        const user = {
            vkId: fetchedUser.id,
            firstName: fetchedUser.first_name,
            lastName: fetchedUser.last_name,
            avatar: fetchedUser.photo_100,
            balance: text,
        };

        instance.post("/create-user", user)
            .then((r) => {
                users.map((u) => {
                    if (u.vkId === currentUser.vkId)
                        u.balance = r.data.balance;
                })
            })
            .catch((e) => console.log(e));

    };

    return (<ConfigProvider>
        <AdaptivityProvider>
            <AppRoot>
                <div className={"header-title"}>
                    <h1 className={"title"} style={{color: "white"}}>Wheel of fortune</h1>
                </div>
                <div className={"content"}>
                    <WheelComponent
                        segments={["750", "400", "250", "200", "150", "100", "10", "JACKPOT"]}
                        segColors={["#292929", "#FFCD7E", "#292929", "#FFCD7E", "#292929", "#FFCD7E", "#292929", "#FFCD7E"]}
                        upDuration={50}
                        downDuration={1000}
                        size={270}
                        primaryColor={"black"}
                        spin={spin}
                        onFinished={handleSpinFinish}
                    />
                    <div className={"group-buttons"}>
                        <button className={"jackpot-1000"} onClick={handleJackpotClick}>Jackpot 1000</button>
                        <button
                            className={"balance-100"}>Balance {currentUser?.balance || 0}</button>
                        <button className={"spin-wheel"} onClick={handleSpinClick}>Spin wheel</button>
                    </div>
                </div>
                <div className={"winners"}>
                    <div className={"winners-block"}>
                        <h1 className={"title"} style={{color: "white"}}>Winners</h1>
                        <div className={"list"}>
                            {users.map((item, key) => (
                                <div key={key} className={"item"}>
                                    <div className={"details"}>
                                        <div className={"avatar-block"}>
                                            <img src={item.avatar} alt={"test"} width={37} height={37}/>
                                            <h3 style={{color: "white"}}>{item.firstName} {item.lastName}</h3>
                                        </div>
                                        <div className={"coins-block"}>
                                            <h3 style={{color: "white"}}
                                                data-custom={item.balance}>{item.balance || "0"}</h3>
                                            <img src={coins} alt={"coins"} width={21} height={14}/>
                                        </div>
                                    </div>
                                    <div className={"time"}>
                                        <h3 style={{color: "white"}}>{new Date().getMinutes() - new Date(item.date).getMinutes()} м.</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {isOpenModal && <Modal setIsOpen={setIsOpenModal} point={point}/>}
            </AppRoot>
        </AdaptivityProvider>
    </ConfigProvider>);
}

export default App;
