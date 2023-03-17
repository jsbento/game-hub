import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

const Login: React.FC = () => {
    const [ isLogin, setIsLogin ] = useState<boolean>(true);

    const onClickLogin = () => {
        setIsLogin(true);
    }

    const onClickSignUp = () => {
        setIsLogin(false);
    }

    return (
        <div>
            { isLogin ? <LoginForm /> : <SignUpForm /> }
            <button onClick={ onClickLogin }>Login</button>
            <button onClick={ onClickSignUp }>Sign Up</button>
        </div>
    );
}

export default Login;