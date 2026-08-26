import { useCallback, useEffect, useState } from "react";
import "./user.css";
import Pagination from "../../../Component/Pagination/pagination";
import { Link, useParams } from "react-router-dom";
import Swal from 'sweetalert2';


export default function ManageUser() {
    const [users, setUsers] = useState([]);
    const [statistic, setStatistic] = useState([]);
    const params = useParams();
    const [currentPage, setCurrentPage] = useState(params.page || 1);
    const [totalPage, setTotalPage] = useState(0);
    const [filterRole, setFilterRole] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [search, setSearch] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name == "role") {
            setFilterRole(value);
        } else if (name == "status") {
            setFilterStatus(value);
        }
        setSearch(value);
    }

    const handleChangeStatus = useCallback((id, status) => {
        fetch(`http://localhost:5000/admin/user/change-status/${status}/${id}`, {
            method: "PATCH",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "🎉 Thành công!",
                        text: "Cập nhật tài khoản thành công.",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#22c55e",
                        toast: true,
                        position: "top-end"
                    });
                    const newUsers = users.map((item) => {
                        if (item._id == id) item.status = status;
                        return { ...item };
                    })
                    setUsers(newUsers);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "❌ Có lỗi xảy ra!",
                        text: data.message,
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#ef4444",
                        toast: true,
                        position: "top-end"
                    });
                }
            })
    }, [])

    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage])


    useEffect(() => {
        fetch(`http://localhost:5000/admin/user?page=${currentPage}&role=${filterRole}&status=${filterStatus}&search=${search}`, {
            "credentials": "include"
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.success) {
                    setStatistic(data.statistic);
                    setUsers(data.users);
                    setCurrentPage(data.currentPage);
                    setTotalPage(data.totalPage);
                }
            })
    }, [currentPage, filterRole, filterStatus, search])

    return (
        <>
            <div className="user-management">
                {/* Header */}
                <div className="user-header">
                    <div>
                        <h1>Quản lý tài khoản</h1>
                        <p>
                            Quản lý thông tin và trạng thái tài khoản
                            người dùng
                        </p>
                    </div>

                    <button className="add-user-btn">
                        + Thêm tài khoản
                    </button>
                </div>

                {/* Statistics */}
                <div className="user-statistics">

                    <div className="user-stat-card">
                        <div className="stat-icon blue">👥</div>
                        <div>
                            <span>Tổng tài khoản</span>
                            <strong>{statistic.totalUser}</strong>
                        </div>
                    </div>

                    <div className="user-stat-card">
                        <div className="stat-icon green">✓</div>
                        <div>
                            <span>Đang hoạt động</span>
                            <strong>{statistic.totalActive}</strong>
                        </div>
                    </div>

                    <div className="user-stat-card">
                        <div className="stat-icon red">🔒</div>
                        <div>
                            <span>Bị khóa</span>
                            <strong>{statistic.totalBanned}</strong>
                        </div>
                    </div>

                    <div className="user-stat-card">
                        <div className="stat-icon orange">🏠</div>
                        <div>
                            <span>Chủ cơ sở</span>
                            <strong>{statistic.totalOwner}</strong>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="user-table-container">

                    {/* Filter */}
                    <div className="user-filter">

                        <div className="user-search">
                            <span>⌕</span>
                            <input
                                type="text"
                                name="search"
                                placeholder="Tìm kiếm tài khoản..."
                                onChange={handleChange}
                            />
                        </div>

                        <select name="role" onChange={handleChange}>
                            <option value="all">Tất cả vai trò</option>
                            <option value="user">Khách hàng</option>
                            <option value="owner">Chủ cơ sở</option>
                        </select>

                        <select name="status" onChange={handleChange}>
                            <option value="all">Tất cả trạng thái</option>
                            <option value="active">Đang hoạt động</option>
                            <option value="banned">Bị khóa</option>
                        </select>

                    </div>

                    {/* Table */}
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Người dùng</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">
                                                <img src={user.avatar}></img>
                                            </div>
                                            <div>
                                                <strong>
                                                    {user.username}
                                                </strong>
                                                <small>
                                                    Người dùng TripNest
                                                </small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span
                                            className={
                                                user.role === "owner"
                                                    ? "role-owner"
                                                    : "role-customer"
                                            }
                                        >
                                            {user.role == "owner" ? "Chủ cơ sở" : "Khách hàng"}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.status === "banned"
                                                    ? "status-locked"
                                                    : "status-active"
                                            }
                                        >
                                            <i></i>
                                            {user.status == "banned" ? "Bị khoá" : "Hoạt động"}
                                        </span>
                                    </td>

                                    <td>{user.createdAt}</td>

                                    <td>
                                        <div className="user-actions">
                                            <Link to={`/admin/user/detail/${user._id}`} className="text-decoration-none">
                                                <button title="Xem">
                                                    👁
                                                </button>
                                            </Link>
                                            <Link to={`/admin/user/edit/${user._id}`} className="text-decoration-none">
                                                <button title="Chỉnh sửa">
                                                    ✏️
                                                </button>
                                            </Link>

                                            {user?.status == "banned" ? <><button title="Khóa tài khoản" onClick={() => { handleChangeStatus(user._id, "active") }}>
                                                🔓
                                            </button></> : <button title="Khóa tài khoản" onClick={() => { handleChangeStatus(user._id, "banned") }}>
                                                🔒
                                            </button>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination UI */}
                    <div className="user-pagination">

                        <span>
                            Hiển thị 1–10 trong {statistic.totalUser} tài khoản
                        </span>
                        <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={onPageChange} />
                    </div>
                </div>
            </div>
        </>
    )
}