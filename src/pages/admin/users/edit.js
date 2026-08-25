import React, { useState } from "react";
import "../../../assets/css/admin/users/edit-user.css";

export default function EditUser() {
    const [user, setUser] = useState({
        full_name: "Nguyễn Văn An",
        username: "nguyenvanan",
        email: "nguyenvanan@gmail.com",
        phone: "0987654321",
        CCCD: "001234567890",
        role: "client",
        status: "active",
        stk: "1023456789",
        bank_name: "Vietcombank",
        tax_code: "0101234567"
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="edit-user">

            <div className="edit-user-header">
                <div>
                    <h1>Chỉnh sửa thông tin</h1>
                    <p>Cập nhật thông tin tài khoản người dùng</p>
                </div>

                <button className="back-btn">
                    ← Quay lại
                </button>
            </div>

            <div className="edit-user-content">

                <div className="edit-card">
                    <div className="edit-card-header">
                        <h3>Thông tin cá nhân</h3>
                        <span>Thông tin cơ bản của người dùng</span>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input
                                type="text"
                                name="full_name"
                                value={user.full_name}
                                onChange={handleChange}
                                placeholder="Nhập họ và tên"
                            />
                        </div>

                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <input
                                type="text"
                                name="username"
                                value={user.username}
                                onChange={handleChange}
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={user.email}
                                onChange={handleChange}
                                placeholder="Nhập email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                value={user.phone}
                                onChange={handleChange}
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div className="form-group">
                            <label>Số CCCD</label>
                            <input
                                type="text"
                                name="CCCD"
                                value={user.CCCD}
                                onChange={handleChange}
                                placeholder="Nhập số CCCD"
                            />
                        </div>

                    </div>
                </div>

                <div className="edit-card">
                    <div className="edit-card-header">
                        <h3>Thông tin tài khoản</h3>
                        <span>Thiết lập quyền và trạng thái</span>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Vai trò</label>

                            <select
                                name="role"
                                value={user.role}
                                onChange={handleChange}
                            >
                                <option value="client">
                                    Khách hàng
                                </option>

                                <option value="owner">
                                    Chủ cơ sở
                                </option>

                                <option value="admin">
                                    Quản trị viên
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>

                            <select
                                name="status"
                                value={user.status}
                                onChange={handleChange}
                            >
                                <option value="active">
                                    Đang hoạt động
                                </option>

                                <option value="locked">
                                    Đã khóa
                                </option>
                            </select>
                        </div>

                    </div>
                </div>

                <div className="edit-card">
                    <div className="edit-card-header">
                        <h3>Thông tin kinh doanh</h3>
                        <span>
                            Thông tin ngân hàng và giấy tờ
                        </span>
                    </div>

                    <div className="form-grid">

                        <div className="form-group">
                            <label>Số tài khoản</label>
                            <input
                                type="text"
                                name="stk"
                                value={user.stk}
                                onChange={handleChange}
                                placeholder="Nhập số tài khoản"
                            />
                        </div>

                        <div className="form-group">
                            <label>Ngân hàng</label>

                            <select
                                name="bank_name"
                                value={user.bank_name}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Chọn ngân hàng
                                </option>

                                <option value="Vietcombank">
                                    Vietcombank
                                </option>

                                <option value="BIDV">
                                    BIDV
                                </option>

                                <option value="VietinBank">
                                    VietinBank
                                </option>

                                <option value="Techcombank">
                                    Techcombank
                                </option>

                                <option value="MB Bank">
                                    MB Bank
                                </option>

                                <option value="ACB">
                                    ACB
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Mã số thuế</label>

                            <input
                                type="text"
                                name="tax_code"
                                value={user.tax_code}
                                onChange={handleChange}
                                placeholder="Nhập mã số thuế"
                            />
                        </div>

                    </div>
                </div>

                <div className="edit-card">
                    <div className="edit-card-header">
                        <h3>Ảnh giấy tờ</h3>
                        <span>
                            Cập nhật ảnh CCCD và giấy phép kinh doanh
                        </span>
                    </div>

                    <div className="upload-section">

                        <div className="upload-group">
                            <label>CCCD mặt trước</label>

                            <div className="upload-box">
                                <span>📷</span>
                                <p>Chọn ảnh mặt trước</p>

                                <input
                                    type="file"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="upload-group">
                            <label>CCCD mặt sau</label>

                            <div className="upload-box">
                                <span>📷</span>
                                <p>Chọn ảnh mặt sau</p>

                                <input
                                    type="file"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="upload-group">
                            <label>Giấy phép kinh doanh</label>

                            <div className="upload-box">
                                <span>📄</span>
                                <p>Chọn ảnh giấy phép</p>

                                <input
                                    type="file"
                                    accept="image/*"
                                />
                            </div>
                        </div>

                    </div>
                </div>

                <div className="edit-actions">
                    <button className="cancel-btn">
                        Hủy
                    </button>

                    <button className="save-btn">
                        💾 Lưu thay đổi
                    </button>
                </div>

            </div>
        </div>
    );
}