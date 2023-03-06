import React, { useState } from "react";

type LoginProps = {
    visible: boolean;
}

const LoginForm: React.FC<LoginProps> = ({ visible }) => {
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
    }

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("submit");
    }

    return visible ? (
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
    ) : null;
}

export default LoginForm;