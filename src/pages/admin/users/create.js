import React, { useCallback, useEffect, useState } from "react";
import "../../../assets/css/admin/users/edit-user.css";
import { Image } from "antd";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

export default function CreateUser() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [user, setUser] = useState({
        full_name: "",
        username: "",
        email: "",
        phone: "",
        CCCD: "",
        role: "client",
        status: "active",
        stk: "",
        bank_name: "",
        tax_code: "",
        avatar: ""
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [idCardFrontPreview, setIDCardFrontPreview] = useState("");
    const [idCardBackPreview, setIDCardBackPreview] = useState("");
    const [businessLisence, setBusinessLisence] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    // Hiển thị Image ảo
    const handleChangeImage = useCallback((e) => {
        const { name, files } = e.target;
        const url = URL.createObjectURL(e.target.files[0]);
        if (name == "avatar") setAvatarPreview(url);
        else if (name == "id_card_front") setIDCardFrontPreview(url);
        else if (name == "id_card_back") setIDCardBackPreview(url);
        else if (name == "business_lisence") setBusinessLisence(url);
    }, [])
    //

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        const formData = new FormData();

        Object.keys(user).forEach((key) => {
            if (
                key !== "avatar" &&
                key !== "id_card_front" &&
                key !== "id_card_back" &&
                key !== "business_lisence"
            ) {
                formData.append(key, user[key]);
            }
        });

        const inputFiles = document.querySelectorAll("input[type='file']");

        if (inputFiles.length > 0) {
            inputFiles.forEach((input) => {
                if (input.files[0]) {
                    formData.append(
                        input.getAttribute("name"),
                        input.files[0]
                    );
                }
            });
        }

        fetch(apiUrl + `admin/user/create`, {
            method: "POST",
            credentials: 'include',
            body: formData
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || "Có lỗi xảy ra!");
                }
                return data;
            })
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "🎉 Thành công!",
                        text: "Tạo mới tài khoản người dùng thành công",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#22c55e",
                        toast: true,
                        position: "top-end"
                    });
                    navigate("/admin/user");
                }
            }).catch(ex => {
                Swal.fire({
                    icon: "error",
                    title: "❌ Có lỗi xảy ra!",
                    text: `${ex.message}`,
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    background: "#ffffff",
                    color: "#333",
                    iconColor: "#ef4444",
                    toast: true,
                    position: "top-end"
                });
            })
    }, [user])

    return (
        <div className="edit-user">
            <div className="edit-user-header">
                <div>
                    <h1>Tạo mới tài khoản</h1>
                    <p>Tạo mới tài khoản người dùng</p>
                </div>
                <Link to={"/admin"}><button className="back-btn">← Quay lại</button></Link>
            </div>

            <form onSubmit={handleSubmit} className="edit-user-content">
                <div className="edit-card">
                    <div className="edit-card-header">
                        <h3>Thông tin cá nhân</h3>
                        <span>Thông tin cơ bản của người dùng</span>
                    </div>

                    <div className="avatar-edit">
                        <div className="avatar-preview">
                            {avatarPreview ?
                                <img src={avatarPreview} alt="Avatar" /> :
                                <div className="avatar-default">
                                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                                </div>
                            }
                        </div>

                        <div className="avatar-info">
                            <label>Ảnh đại diện</label>
                            <p>JPG, JPEG hoặc PNG. Dung lượng tối đa 5MB.</p>
                            <label className="avatar-upload-btn">
                                Chọn ảnh
                                <input type="file" name="avatar" accept="image/jpeg,image/jpg,image/png" onChange={handleChangeImage} />
                            </label>
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input type="text" name="full_name" value={user.full_name || ""} onChange={handleChange} placeholder="Nhập họ và tên" />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={user.email || ""} onChange={handleChange} placeholder="Nhập email" />
                        </div>

                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="text" name="phone" value={user.phone || ""} onChange={handleChange} placeholder="Nhập số điện thoại" />
                        </div>

                        <div className="form-group">
                            <label>Số CCCD</label>
                            <input type="text" name="CCCD" value={user.CCCD || ""} onChange={handleChange} placeholder="Nhập số CCCD" />
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
                            <label>Tên đăng nhập</label>
                            <input type="text" name="username" onChange={handleChange} placeholder="Nhập tên đăng nhập" />
                        </div>
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input type="password" name="password" onChange={handleChange} placeholder="Nhập tên đăng nhập" />
                        </div>

                        <div className="form-group">
                            <label>Vai trò</label>
                            <select name="role" value={user.role || "client"} onChange={handleChange}>
                                <option value="client">Khách hàng</option>
                                <option value="owner">Chủ cơ sở</option>
                                <option value="admin">Quản trị viên</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="status" value={user.status || "active"} onChange={handleChange}>
                                <option value="active">Đang hoạt động</option>
                                <option value="locked">Đã khóa</option>
                            </select>
                        </div>
                    </div>
                </div>

                {user.role === "owner" && (
                    <div className="edit-card">
                        <div className="edit-card-header">
                            <h3>Thông tin kinh doanh</h3>
                            <span>Thông tin ngân hàng và giấy tờ</span>
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Số tài khoản</label>
                                <input type="text" name="stk" onChange={handleChange} placeholder="Nhập số tài khoản" />
                            </div>

                            <div className="form-group">
                                <label>Ngân hàng</label>
                                <select name="bank_name" onChange={handleChange}>
                                    <option value="">Chọn ngân hàng</option>
                                    <option value="Vietcombank">Vietcombank</option>
                                    <option value="BIDV">BIDV</option>
                                    <option value="VietinBank">VietinBank</option>
                                    <option value="Techcombank">Techcombank</option>
                                    <option value="MB Bank">MB Bank</option>
                                    <option value="ACB">ACB</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Mã số thuế</label>
                                <input type="text" name="tax_code" onChange={handleChange} placeholder="Nhập mã số thuế" />
                            </div>
                        </div>
                    </div>
                )}

                {user.role === "owner" && (
                    <div className="edit-card">
                        <div className="edit-card-header">
                            <h3>Ảnh giấy tờ</h3>
                            <span>Cập nhật ảnh CCCD và giấy phép kinh doanh</span>
                        </div>

                        <div className="upload-section">
                            <div className="upload-group">
                                <div className="d-flex items-center justify-between">
                                    <label>CCCD mặt trước</label>
                                    <label htmlFor="id_card_front">Chọn ảnh</label>
                                </div>
                                <div className="upload-box cursor-pointer">
                                    {idCardFrontPreview != "" ? <Image src={idCardFrontPreview}></Image> : <><span>📷</span>
                                        <p>Chọn ảnh mặt trước</p></>}
                                    <input type="file" name="id_card_front" id="id_card_front" accept="image/*" hidden onChange={handleChangeImage} />
                                </div>
                            </div>
                            <div className="upload-group">
                                <div className="d-flex items-center justify-between">
                                    <label>CCCD mặt sau</label>
                                    <label htmlFor="id_card_back">Chọn ảnh</label>
                                </div>
                                <div className="upload-box cursor-pointer">
                                    {idCardBackPreview != "" ? <Image src={idCardBackPreview}></Image> : <><span>📷</span>
                                        <p>Chọn ảnh mặt sau</p></>}
                                    <input type="file" name="id_card_back" id="id_card_back" accept="image/*" hidden onChange={handleChangeImage} />
                                </div>
                            </div>
                            <div className="upload-group">
                                <div className="d-flex items-center justify-between">
                                    <label>Giấy phép kinh doanh</label>
                                    <label htmlFor="business_lisence">Chọn ảnh</label>
                                </div>
                                <div className="upload-box cursor-pointer">
                                    {businessLisence != "" ? <Image src={businessLisence}></Image> : <>
                                        <span>📄</span>
                                        <p>Chọn ảnh giấy phép</p></>}
                                    <input type="file" name="business_lisence" id="business_lisence" accept="image/*" hidden onChange={handleChangeImage} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="edit-actions">
                    <button className="cancel-btn">Hủy</button>
                    <button className="save-btn">💾 Lưu thay đổi</button>
                </div>
            </form>
        </div>
    )
}