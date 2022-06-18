import React, {FC, useContext, useState} from 'react';
import {observer} from "mobx-react-lite";
import {Context} from "../index";

const LoginForm: FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const {store} = useContext(Context)


    return (
        <div>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={() => store.login(email, password)}>Логин</button>
            <button onClick={() => store.registration(email, password)}>Регистрация</button>
        </div>
    )
}

export default observer(LoginForm)