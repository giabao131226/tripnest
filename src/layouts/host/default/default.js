import { Outlet } from "react-router-dom";
import {useSelector} from "react-redux";
import "./default.css";
import Sider from "../../../partials/admin/sider/sider";

export default function LayoutDefaultHost(){

    const user = useSelector(state => state.auth).payload;

    return (
        <>
            <div className="layout-admin d-flex">
                <Sider user = {user} />
                <div className="d-flex flex-column col-12 px-0 py-0">
                    <header className="text-white bg-black px-3 py-0 d-flex justify-between items-center">
                        <span>Host</span>
                        <div className="d-flex items-center gap-x-3">
                            <div className="avatar">
                                <img src = {user?.avatar ? user.avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7kl56iqHHrBNGF1MuPsfn2CoJ8GGhzeAvxEsCEZE0ks8FyzHmdowZQqPY&s=10"}></img>
                            </div>
                            <span className="adminName font-bold">Xin chào {user?.userName}!!</span>
                            <button className="bg-red text-white font-bold px-2 py-2 border-none rounded">Đăng xuất</button>
                        </div>
                    </header>
                    <Outlet context = {{user}} />
                </div>
            </div>
        </>
    )
}