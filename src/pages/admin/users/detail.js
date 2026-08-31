import React, { useCallback, useEffect, useImperativeHandle, useState } from "react";
import "./user-detail.css";
import { Link, useParams } from "react-router-dom";
import { Image } from "antd";
import Swal from 'sweetalert2';

export default function UserDetail() {
    const [detail, setDetail] = useState([]);
    const params = useParams();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handleChangeStatus = useCallback((id, status) => {
        fetch(`${apiUrl}admin/user/change-status/${status}/${id}`, {
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
                    setDetail({ ...detail, "status": status });
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
    }, [detail])

    useEffect(() => {
        fetch(apiUrl + `admin/user/detail/${params.id}`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setDetail(data.detail);
                } else {

                }
            })
    }, [])
    return (
        <div className="user-detail">
            <div className="user-detail-header">
                <div>
                    <h1>Thông tin tài khoản</h1>
                    <p>Xem thông tin chi tiết người dùng</p>
                </div>

                <Link to={"/admin/user"}><button className="back-btn">
                    ← Quay lại
                </button></Link>
            </div>

            <div className="user-profile-card">
                <div className="user-profile">
                    <img src={detail.avatar} className="user-detail-avatar"></img>

                    <div>
                        <h2>{detail.username}</h2>
                        <p>{detail.email}</p>

                        <div className="user-badges">
                            <span className="role-badge">
                                {detail.role == "owner" ? "Chủ cơ sở" : "Khách hàng"}
                            </span>

                            <span className="status-active">
                                <i></i>
                                {detail.status == "banned" ? "Đã bị khoá" : "Đang hoạt động"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="user-actions">
                    <Link to={`/admin/user/edit/${params.id}`} className="text-decoration-none">
                        <button className="edit-btn">
                            ✏️
                        </button>
                    </Link>

                    {detail?.status == "banned" ? <><button title="Khóa tài khoản" onClick={() => { handleChangeStatus(detail._id, "active") }}>
                        🔓
                    </button></> : <button title="Khóa tài khoản" onClick={() => { handleChangeStatus(detail._id, "banned") }}>
                        🔒
                    </button>}
                </div>
            </div>

            <div className="user-info-card">
                <div className="card-header">
                    <h3>Thông tin cá nhân</h3>
                    <span>Thông tin cơ bản của người dùng</span>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Họ và tên</label>
                        <p>{detail.full_name}</p>
                    </div>

                    <div className="info-item">
                        <label>Email</label>
                        <p>{detail.email}</p>
                    </div>

                    <div className="info-item">
                        <label>Số điện thoại</label>
                        <p>{detail.phone}</p>
                    </div>

                    <div className="info-item">
                        <label>CCCD</label>
                        <p>{detail.CCCD}</p>
                    </div>
                </div>
            </div>

            <div className="user-info-card">
                <div className="card-header">
                    <h3>Thông tin tài khoản</h3>
                    <span>Thông tin quản lý tài khoản</span>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Tên đăng nhập</label>
                        <p>{ }</p>
                    </div>

                    <div className="info-item">
                        <label>Vai trò</label>
                        <p>
                            <span className="role-badge">
                                Khách hàng
                            </span>
                        </p>
                    </div>

                    <div className="info-item">
                        <label>Trạng thái</label>
                        <p>
                            <span className="status-active">
                                <i></i>
                                {detail.status == "banned" ? "Đã bị khoá" : "Đang hoạt động"}
                            </span>
                        </p>
                    </div>

                    <div className="info-item">
                        <label>Ngày tạo</label>
                        <p>{new Date(detail.createdAt).toLocaleString("vi-VN")}</p>
                    </div>

                    <div className="info-item">
                        <label>Cập nhật lần cuối</label>
                        <p>{new Date(detail.updatedAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                </div>
            </div>

            <div className="user-info-card">
                <div className="card-header">
                    <h3>Thông tin kinh doanh</h3>
                    <span>
                        Thông tin giấy tờ và tài khoản ngân hàng
                    </span>
                </div>

                <div className="document-section">
                    <div className="document-group">
                        <label>Căn cước công dân</label>

                        <div className="document-images">
                            <div className="document-image">
                                <Image
                                    src={detail.id_code_front ? detail.id_code_front : "https://placehold.co/500x300?text=CCCD+Mat+Truoc"}
                                    alt="CCCD mặt trước"
                                >
                                </Image>
                                <span>Mặt trước</span>
                            </div>
                            <div className="document-image">
                                <Image
                                    src={detail.id_code_back ? detail.id_code_back : "https://placehold.co/500x300?text=CCCD+Mat+Sau"}
                                    alt="CCCD mặt sau"
                                >
                                </Image>
                                <span>Mặt sau</span>
                            </div>
                        </div>
                    </div>

                    <div className="document-group">
                        <label>Giấy phép kinh doanh</label>
                        <div className="document-image business-license">
                            <Image
                                src={detail.business_lisence ? detail.business_lisence : "https://placehold.co/500x300?text=Giay+Phep+Kinh+Doanh"}
                                alt="Giấy phép kinh doanh"
                            >
                            </Image>
                        </div>
                    </div>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Số tài khoản</label>
                        <p>1023456789</p>
                    </div>

                    <div className="info-item">
                        <label>Ngân hàng</label>
                        <p>Vietcombank</p>
                    </div>

                    <div className="info-item">
                        <label>Mã số thuế</label>
                        <p>0101234567</p>
                    </div>

                    <div className="info-item">
                        <label>Chủ tài khoản</label>
                        <p>NGUYEN VAN AN</p>
                    </div>
                </div>
            </div>
        </div>
    );
}