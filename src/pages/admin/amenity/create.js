import { useCallback, useState } from "react";
import "../../../assets/css/admin/category/create.css";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";

export default function CreateAmenity() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const [data, setData] = useState({
        name: "",
        status: "active",
        icon: ""
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleSelectIcon = useCallback((icon) => {
        setData(prev => ({
            ...prev,
            icon
        }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!data.name.trim()) {
            SwalAlert({
                status: "error",
                time: 2000,
                message: "Vui lòng nhập tên tiện ích"
            });
            return;
        }

        const payload = {
            name: data.name.trim(),
            status: data.status,
            icon: data.icon
        };

        fetch(`${apiUrl}amenities/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                const result = await res.json();

                if (!res.ok) {
                    throw new Error(result.message);
                }

                return result;
            })
            .then(result => {
                if (result.success) {
                    SwalAlert({
                        status: "success",
                        time: 2000,
                        message: result.message
                    });
                    setData({
                        name: "",
                        status: "active",
                        icon: ""
                    })
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, data]);

    return (
        <div className="category-create">
            <div className="category-create__container">
                <div className="category-create__header">
                    <div>
                        <h1>Thêm Mới Tiện Ích</h1>
                        <p>Thêm tiện ích mới cho các cơ sở lưu trú trên TripNest</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="category-create__content">
                        <div className="category-create__form">
                            <div className="form-card">
                                <div className="form-card__header">
                                    <h2>Thông Tin Tiện Ích</h2>
                                    <p>Nhập thông tin cơ bản của tiện ích</p>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Tên Tiện Ích
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: WiFi, Hồ bơi, Điều hòa..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Biểu Tượng
                                        <span>*</span>
                                    </label>


                                    <input
                                        type="text"
                                        name="icon"
                                        value={data.icon}
                                        onChange={handleChange}
                                        placeholder="Lấy tên class của icon trong font-awesome"
                                    />

                                </div>

                                <div className="form-group">
                                    <label>Trạng Thái</label>

                                    <div className="status-options">
                                        <label className="status-option">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="active"
                                                checked={data.status === "active"}
                                                onChange={handleChange}
                                            />

                                            <span className="status-option__content">
                                                <span className="status-dot active"></span>

                                                <span>
                                                    <strong>Hoạt động</strong>
                                                    <small>
                                                        Tiện ích được sử dụng trên hệ thống
                                                    </small>
                                                </span>
                                            </span>
                                        </label>

                                        <label className="status-option">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="banned"
                                                checked={data.status === "banned"}
                                                onChange={handleChange}
                                            />

                                            <span className="status-option__content">
                                                <span className="status-dot banned"></span>

                                                <span>
                                                    <strong>Bị khóa</strong>
                                                    <small>
                                                        Tiện ích không được sử dụng
                                                    </small>
                                                </span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                    >
                                        Hủy
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn-create"
                                    >
                                        + Thêm Tiện Ích
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="category-create__preview">
                            <div className="preview-card">
                                <div className="preview-card__header">
                                    <h2>Xem Trước</h2>
                                    <span>Preview</span>
                                </div>

                                <div className="category-preview">
                                    <div className="category-preview__icon">
                                        <i className={`${data.icon}`}></i>
                                    </div>

                                    <div className="category-preview__info">
                                        <h3>
                                            {data.name.trim() || "Tên tiện ích"}
                                        </h3>

                                        <span
                                            className={`category-preview__status ${data.status === "active"
                                                ? "active"
                                                : "banned"
                                                }`}
                                        >
                                            <i></i>

                                            {data.status === "active"
                                                ? "Hoạt động"
                                                : "Bị khóa"}
                                        </span>
                                    </div>
                                </div>

                                <div className="preview-info">
                                    <div>
                                        <span>Ngày tạo</span>
                                        <strong>{new Date().toLocaleDateString("vi-VN")}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}