import avatar from "../../assets/img/Logo-final.PNG"
import { IoMdPerson } from "react-icons/io";
import "./head.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react"
import { changeHeader } from "../actions/actions"
import { Button } from "antd"
import SignIn from "../Signin/signin";
import Register from "../Register/register";
import { Dropdown, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { message } from "antd";
import { IoPersonCircle } from "react-icons/io5";


function Header({isOMSignIn,isOMRegister,openModalSI,handleCancel,openModalRegister,handleCancel2}) {
    const user = useSelector(state => state.auth).payload;
    const isActive = useSelector(state => state.changeAttHeader)
    const disPatch = useDispatch();
    const [cookie, setCookie] = useState('')
    const [messageApi, contextHolder] = message.useMessage();
    const [acc, setAcc] = useState({})
    const [reload, setReload] = useState(false)
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleReload = useCallback(() => {
        setReload(!reload)
    }, [])
    //
    const handleLogout = useCallback(() => {
        fetch(`${apiUrl}account/logout`,{
            method: "POST",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if(data.success) disPatch({type: "UPDATE","payload": null})
            }) 
        handleReload();
    }, [])
    const handleClickHistory = useCallback(() => {
        messageApi.open({
            "type" : "success",
            "content": "Tính năng sẽ được cập nhật sau"
        })
    }, [])
    const handleNavigateProperty = useCallback(() => {
        if(user && user._id){
            if(user.role=="qtv" || user.role=="owner"){
                navigate("/your-property");
            }
            else{
                messageApi.open({
                    "type": "error",
                    "content": "Bạn Không Đủ Quyền Để Truy Cập Trang Này. Hãy Nâng Cấp Quyền Nhé!!"
                })
                navigate("/quan-ly-tai-khoan")
            }
        }else{
            messageApi.open({
                "type": "error",
                "content": "Bạn phải đăng nhập trước đã"
            })
            openModalSI();
        }
    },[user])
    const items = [
        {
            key: '1',
            label: (<button onClick={handleClickHistory}>Thông Báo</button>)
        },
        {
            key: '2',
            label: (<Link to = {"/quan-ly-tai-khoan"}><button >Quản Lý Tài Khoản</button></Link>)
        },
        {
            key: '3',
            label: (<Link to = {"/history-book"}><button>Lịch Sử Đặt Phòng</button></Link>)
        },
        {
            key: '4',
            label: (<Link to = {"/host"}><button className={user?.role != "owner" ? "display__none" : ""}>Kênh chủ phòng</button></Link>)
        },
        {
            key: '5',
            label: (<button onClick={handleLogout} className="button__logout">Đăng Xuất</button>)
        }
    ]
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200 || window.location.pathname != "/") {
                disPatch(changeHeader(true))
            } else {
                disPatch(changeHeader(false))
            }
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    return (
        <>
            {contextHolder}
            <div className={isActive ? "header2" : "header"}>
                <div className={isActive ? "header2__container" : "header__container"}>
                    <div className={isActive ? "header2__tool" : "header__tool"}>
                        <Link to={"/"}>
                            <div className="header__logo">
                                <img src={avatar}></img>
                            </div>
                        </Link>
                        <div className={isActive ? "header2__toolMain" : "header__toolMain"}>
                            <ul>
                                <Link to={"/"}><li>Trang Chủ</li></Link>
                                <li>Phòng</li>
                                <li><button onClick={handleNavigateProperty} className={isActive ? "text-color-black bg-none" : "text-color-white bg-none"}>Danh Sách BĐS của bạn</button></li>
                            </ul>
                            {user ? <div className="user">
                                <div className="user__container">
                                    <Dropdown menu={{ items }}>
                                        <a href="#" onClick={e => e.preventDefault()}>
                                            <Space style={{ color: "black" }}>
                                                <div className = "user-avatar">
                                                    <img src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRb737h3r1Md9MgZxrZN3KENVQJe0mNHgyGfvVjZjRA6x2JAeByMDYEp58&s=10"></img>
                                                </div>
                                                {user.username}
                                                <DownOutlined />
                                            </Space>
                                        </a>
                                    </Dropdown>
                                </div>
                            </div> : <div className="header__button">
                                <Button type="primary" onClick={openModalSI}><IoMdPerson /> Đăng Nhập</Button>
                                <Button type="primary" onClick={openModalRegister}>Đăng Ký</Button>
                            </div>}

                        </div>
                    </div>
                </div>
            </div>
            {user ? <></> : <>
                <><SignIn open={isOMSignIn} setCookie={setCookie} handleCancel={handleCancel} setAcc={setAcc} />
                <Register open={isOMRegister} handleCancel={handleCancel2} openModalSI  = {openModalSI} handleCancel2  ={handleCancel2}/></>
            </>}
        </>
    )
}
export default Header;