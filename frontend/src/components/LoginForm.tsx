import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { setUser } from "../state/actions/actions";
import { User } from "../types/Users";

const LoginForm: React.FC = () => {
    const dispatch = useDispatch();
    const signIn = (user: User) => dispatch(setUser(user));

    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await fetch("http://localhost:8080/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password,
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.success) {
                signIn(data.user);
            } else {
                console.log(data.message);
            }
        })
        .catch(err => {
            console.log(err);
        });
    }

    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={ onSubmit }>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value={ username } onChange={ onChangeUsername } />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" value={ password } onChange={ onChangePassword } />
                
                    <button type="submit">Login</button>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;