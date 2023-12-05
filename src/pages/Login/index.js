import React, { useState } from "react";
import "./login.css";
import { MdEmail, MdLock } from "react-icons/md";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { message } from "antd";
import api from "../../services/Api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    setShow(!show);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        messageApi.open({
          duration: 2,
          type: "warning",
          content: "Por favor, preencha todos os campos",
        });
        return;
      }
      const response = await api.post("/login", { email, password });
      if (response.status === 200) {
        messageApi.open({
          duration: 2,
          type: "sucess",
          content: response.data.mensagem,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate("/dashboard");
        console.log("login efetuado");
      }
    } catch {}
  };

  return (
    <>
      {contextHolder}
      <div className="login">
        <div className="login-logo">
          <img src="https://lojinha.mindconsulting.com.br/wp-content/uploads/2022/07/bear-png.png" alt="imagem-urso-mind" />
        </div>

        <div className="login-right">
          <h1>Mind Consulting Web</h1>
          <form onSubmit={handleLogin} id="loginForm">
            <div className="loginInput">
              <MdEmail />
              <input
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="loginInput">
              <MdLock />
              <input
                className="inputPassword"
                placeholder="Digite sua senha"
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="login-eye">
                {show ? <HiEye size={20} onClick={handleClick} /> : <HiEyeOff size={20} onClick={handleClick} />}
              </div>
            </div>

            <button type="submit"> Entrar </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
