import { useState } from "react";
import LoginUser from "../js/userLogin";
import miImagen from "../img/logo1.png";
import "../css/login.css"
import "../css/fonts.css"

function Login(){
    const [user, setUser] = useState(LoginUser)

    return(
        <>
            <div className="myContainer">
                <img src={miImagen} alt="Logo del sistema" className="logoSis" />
                <h1>Iniciar sesión</h1>
                <form action="POST" className="login">
                    <input type="email" className="loginInput" name="mail" id="emailLogin" />
                    <input type="password" className="loginInput" name="pass" id="passLogin" />
                    <input type="submit" name="envio" id="sendLogin" />
                </form>
            </div>
        </>
    );
}

export default Login;