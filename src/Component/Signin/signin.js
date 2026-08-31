import { useCallback, useState } from "react";
import Swal from 'sweetalert2';
import { Modal } from "antd";
import "./signin.css"
// Icon
import { IoPerson } from "react-icons/io5";
import { FaLock } from "react-icons/fa";
import Link from "antd/es/typography/Link";
import { useDispatch } from "react-redux";
import { setInfo } from "../actions/actions";

// image
import smileGirl from "../../assets/img/ImgSignIn.png"
import Input from "../InputComponent/input";

//
import { notification } from "antd";

// Hàm JWT-DECODE
import { jwtDecode } from "jwt-decode";
//

function SignIn({ open, setCookie, handleCancel, handleOK, setAcc }) {
    const dispatch = useDispatch()
    const [accountSignIn, setAccountSignIn] = useState({})
    const [errors, setErrors] = useState({})
    const [api, contextHolder] = notification.useNotification();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleChange = useCallback((e) => {
        // ẩn text-error
        const nameKey = e.target.getAttribute("name")
        setErrors({ ...errors, [`${nameKey}`]: "" })
        // 
        const { name, value } = e.target;
        setAccountSignIn({ ...accountSignIn, [name]: value })
    })

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        fetch(`${apiUrl}account/sign-in`, {
            "method": "POST",
            "credentials": "include",
            "headers": {
                "Content-type": "application/json"
            },
            "body": JSON.stringify(accountSignIn)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    dispatch({ type: "UPDATE", "payload": data.user });
                    Swal.fire({
                        icon: "success",
                        title: "🎉 Welcome back!",
                        text: "Login successful! You are ready to explore TripNest 🏡✨",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#22c55e",
                        toast: true,
                        position: "top-end"
                    });
                    handleCancel();
                } else {
                    if (data.errorsValidate) {
                        setErrors(data.errorsValidate);
                    } else {
                        throw (data.message)
                    }
                }
            })
            .catch(err => {
                api.info({
                    title: `Đăng nhập không thành công`,
                    description: `${err}`
                });
            })
    })
    return (
        <>
            {contextHolder}
            <Modal open={open} onCancel={handleCancel} onOk={handleOK} footer={null} style={{ top: "5%" }}>
                <div className="signInFormVienIMG">
                    <img src={smileGirl}></img>
                </div>
                <h1 className="m-0 text-align-center text-purple">WelCome</h1>
                <form className="d-flex flex-column gap-y-2" methods="POST" id="sign-in-form" onSubmit={handleSubmit}>

                    <Input title={"UserName"} nameInput={"userName"} type={"text"} placeholder={"Please enter your name..."} icon={<IoPerson className="iconSignIn" />} onChangeFunction={handleChange} errorContent={errors.userName} />
                    <Input title={"PassWord"} nameInput={"password"} type={"password"} placeholder={"Please enter your password..."} icon={<FaLock className="iconSignIn" />} onChangeFunction={handleChange} errorContent={errors.password} />

                    <Link to={"/forgot-password"}><p className="m-0 font-14 font-bold">Forgot Password?</p></Link>
                    <button type="submit" className="signInButton bg-orange text-white border-none font-bold py-2 rounded cursor-pointer">Sign In</button>

                    <div className="d-flex justify-between items-center">
                        <p className="m-0 font-bold">No Account? Create Here</p>
                        <p className="m-0 font-bold"> Terms and Conditions</p>
                    </div>
                </form>
            </Modal>
        </>
    )
}
export default SignIn;