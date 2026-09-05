import { MdMenu } from "react-icons/md";
import "./sider.css";
import { Link } from "react-router-dom";
import { BiSolidUserAccount } from "react-icons/bi";
import { MdAdminPanelSettings } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { FaHotel } from "react-icons/fa";
import { FaBuildingCircleCheck } from "react-icons/fa6";
import { FaUserGroup } from "react-icons/fa6";

export default function Sider({user}) {
    return (   
        <div className="sider bg-black bg-white d-flex flex-column justify-start px-4 py-2">

            <div className="d-flex items-center justify-between text-white">
                <Link to={"/admin"}>
                    <span className="header-admin-title">{user?.role =="owner" ? "HOST" : "Admin" }</span>
                </Link>

                <button className="cursor-pointer bg-transparent border-none font-20 text-white">
                    <MdMenu />
                </button>
            </div>

            <div className="body">

                <p className="title">TỔNG QUAN</p>

                <div className="main">

                    <Link to="dashboard">
                        <BiSolidUserAccount />
                        <span>Tổng quan</span>
                    </Link>
                </div>

                {user?.role == "admin" ? <><p className="title">Người dùng</p>

                <div className="main">

                    <Link to="/admin/user">
                        <FaUserGroup />
                        <span>Quản lý người dùng</span>
                    </Link>
                </div></> : <></>}

                <p className="title">QUẢN LÝ CƠ SỞ LƯU TRÚ</p>

                <div className="main">

                    <Link to="accommodations">
                        <FaHotel />
                        <span>Quản trị</span>
                    </Link>

                    {user?.role == "admin" ? <Link to="accommodation/kiem-duyet">
                        <FaBuildingCircleCheck />
                        <span>Kiểm duyệt</span>
                    </Link> : <></>}

                </div>

                {user?.role == "admin" ? <><p className="title">PHÂN QUYỀN</p>

                <div className="main">

                    <Link to="/admin/roles">
                        <span>Nhóm quyền</span>
                    </Link>

                    <Link to="/admin/permissions">
                        <span>Phân quyền</span>
                    </Link>

                </div></> : <></>}

            </div>
        </div>
    );
}