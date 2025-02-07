import {  useEffect, useState } from "react";

import * as React from 'react';
import Grid from '@mui/material/Grid2';

import "../css/signup.css";
import "../css/fonts.css";
import "../js/iconLottie";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Swal from 'sweetalert2'

import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";

function Signup(){

    const [user, setUser] = useState({ email: '', passw: '', name:'', pass2:'' });
    const [iconState, setIconState] = useState("in-reveal");
    const [iconTrigger, setIconTrigger] = useState("loop");

    const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
    e.preventDefault();
        if (user.passw !== user.pass2) {
            setIconState("hover-lashes");
            setIconTrigger("morph");
            Swal.fire({
            icon: "Error",
            title: "Contraseña incorrecta",
            text: `Las contraseñas no coinciden`,
            });
        } else {
            setIconState("in-reveal");
            setIconTrigger("loop");
            Swal.fire({
            icon: "success",
            title: "Datos guardados:",
            text: `Nombre: ${user.name}, Correo: ${user.email}, Contraseña: ${user.passw}`,
            });
        }
        setUser({ email: '', passw: '', name:'', pass2:'' });
    };

    return (
        <>
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 4, sm: 6, md: 12 }} className="myContainer2">
            <Grid key={3} size={{ xs: 4, sm: 6, md: 6 }}>
                <div className="signup-form">
                    <h2 id="h1" className="h1">Registrate</h2>
                    <form action="" method="post">
                        <div className="input-wrapper">
                            <input type="text" className="input" placeholder="Nombre de usuario" required name="name" onChange={handleChange}/>
                            <lord-icon
                                id="input-icon-1"
                                src="/icons/persona-icon.json"
                                trigger="loop"
                                stroke="bold"
                                state="in-reveal"
                                colors="primary:#9A0000,secondary:#004D73"
                                style={{width:"1.75em", height:"1.75em"}}>
                            </lord-icon>
                        </div>
                        <br />
                        <div className="input-wrapper">
                            <input type="email" className="input" placeholder="Correo electrónico" required name="email" onChange={handleChange}/>
                            <lord-icon
                                id="input-icon-2"
                                src="/icons/mail-icon.json"
                                trigger="loop"
                                stroke="bold"
                                state="in-reveal"
                                colors="primary:#9A0000,secondary:#004D73"
                                style={{width:"1.5em", height:"1.5em"}}>
                            </lord-icon>
                        </div>
                        <br />
                        <div className="input-wrapper">
                            <input type="password" className="input" placeholder="Contraseña" required name="passw" onChange={handleChange}/>
                            <lord-icon
                                id="input-icon-3"
                                src="/icons/ojo-icon.json"
                                trigger={iconTrigger}
                                stroke="bold"
                                state={iconState}
                                colors="primary:#9A0000,secondary:#004D73"
                                style={{width:"1.5em", height:"1.5em"}}>
                            </lord-icon>
                        </div>
                        <br />
                        <div className="input-wrapper">
                            <input type="password" className="input" placeholder="Confirma contraseña" required name="pass2" onChange={handleChange}/>
                            <lord-icon
                                id="input-icon-3"
                                src="/icons/ojo-icon.json"
                                trigger={iconTrigger}
                                stroke="bold"
                                state={iconState}
                                colors="primary:#9A0000,secondary:#004D73"
                                style={{width:"1.5em", height:"1.5em"}}>
                            </lord-icon>
                        </div>
                        <br />
                        <button type="submit" id="sendSignup" onClick={handleSubmit}>Confirnar registro</button>
                    </form>
                </div>
            </Grid>
            <Grid key={3} size={{ xs: 4, sm: 6, md: 6 }} className="signup-foto">
                <div className="signup-picture">
                    <div className="foto">
                        <img src="https://www.meme-arsenal.com/memes/a513f913ef43476bd2b494da4e599cbc.jpg" alt="Foto de perfil" id="selPict"/>
                        <div className="botonDiv">
                            <input type="file" className="botonCam" accept="image/*"/>
                            <i className="fa fa-camera"></i>
                        </div>
                    </div>
                    <h3 className="h3">¡Crea tu cuenta!</h3>
                    <p className="body-small">Regístrate aquí, y registra a tu equipo posteriormente, espera la respuesta de los administradores para ingresar a tu equipo a los torneos de la liguilla.</p>
                </div>
            </Grid>
        </Grid>
        </>
    )
}

export default Signup
