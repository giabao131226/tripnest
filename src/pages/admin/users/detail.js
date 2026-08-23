import React from "react";
import "./user-detail.css";

export default function UserDetail() {
    return (
        <div className="user-detail">
            <div className="user-detail-header">
                <div>
                    <h1>Thông tin tài khoản</h1>
                    <p>Xem thông tin chi tiết người dùng</p>
                </div>

                <button className="back-btn">
                    ← Quay lại
                </button>
            </div>

            <div className="user-profile-card">
                <div className="user-profile">
                    <div className="user-avatar">
                        NA
                    </div>

                    <div>
                        <h2>Nguyễn Văn An</h2>
                        <p>nguyenvanan@gmail.com</p>

                        <div className="user-badges">
                            <span className="role-badge">
                                Khách hàng
                            </span>

                            <span className="status-active">
                                <i></i>
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>

                <div className="user-actions">
                    <button className="edit-btn">
                        ✏️
                    </button>

                    <button className="lock-btn">
                        🔒
                    </button>
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
                        <p>Nguyễn Văn An</p>
                    </div>

                    <div className="info-item">
                        <label>Email</label>
                        <p>nguyenvanan@gmail.com</p>
                    </div>

                    <div className="info-item">
                        <label>Số điện thoại</label>
                        <p>0987 654 321</p>
                    </div>

                    <div className="info-item">
                        <label>CCCD</label>
                        <p>001234567890</p>
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
                        <p>nguyenvanan</p>
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
                                Đang hoạt động
                            </span>
                        </p>
                    </div>

                    <div className="info-item">
                        <label>Ngày tạo</label>
                        <p>20/08/2026</p>
                    </div>

                    <div className="info-item">
                        <label>Cập nhật lần cuối</label>
                        <p>23/08/2026</p>
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
                                <img
                                    src="https://placehold.co/500x300?text=CCCD+Mat+Truoc"
                                    alt="CCCD mặt trước"
                                />

                                <span>Mặt trước</span>
                            </div>

                            <div className="document-image">
                                <img
                                    src="https://placehold.co/500x300?text=CCCD+Mat+Sau"
                                    alt="CCCD mặt sau"
                                />

                                <span>Mặt sau</span>
                            </div>
                        </div>
                    </div>

                    <div className="document-group">
                        <label>Giấy phép kinh doanh</label>

                        <div className="document-image business-license">
                            <img
                                src="https://placehold.co/500x300?text=Giay+Phep+Kinh+Doanh"
                                alt="Giấy phép kinh doanh"
                            />
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