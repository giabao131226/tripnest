import { useCallback, useEffect, useState } from "react";
import "../../../assets/css/admin/category/create.css";
import {
    FaHotel,
    FaHome,
    FaBuilding,
    FaUmbrellaBeach,
    FaBed
} from "react-icons/fa";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import { useParams } from "react-router-dom";
const iconOptions = [
    {
        name: "hotel",
        component: FaHotel,
        label: "Khách sạn"
    },
    {
        name: "home",
        component: FaHome,
        label: "Nhà ở"
    },
    {
        name: "building",
        component: FaBuilding,
        label: "Tòa nhà"
    },
    {
        name: "villa",
        component: FaBed,
        label: "Villa"
    },
    {
        name: "resort",
        component: FaUmbrellaBeach,
        label: "Resort"
    }
];

export default function EditCategory() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const params = useParams();
    const [data, setData] = useState({
        title: "",
        description: "",
        status: "active",
        icon: "hotel"
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

        if (!data.title.trim()) {
            SwalAlert({
                "status": "error",
                "time": 2000,
                "message": "Vui lòng nhập tên danh mục"
            });
            return;
        }

        const payload = {
            title: data.title.trim(),
            description: data.description.trim(),
            status: data.status,
            icon: data.icon
        };

        fetch(`${apiUrl}categories/edit/${data._id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok) throw new Error(data.message)
                return data;
            }).then(data => {
                if (data.success) {
                    SwalAlert({
                        "status": "success",
                        "time": 2000,
                        "message": data.message
                    });
                    setData(data.newDetail);
                }
            }).catch(ex => {
                SwalAlert({
                    "status": "error",
                    "time": 2000,
                    "message": ex
                });
            })

    }, [data]);

    useEffect(() => {
        fetch(`${apiUrl}categories/detail/${params.slug}`, {
            method: "GET",
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok || !data.success) throw new Error(data.message);
                return data;
            }).then(data => {
                if (data.success) {
                    setData(data.detail);
                }
            }).catch(ex => SwalAlert({
                "status": "error",
                "time": 2000,
                "message": ex
            }))
    }, [])

    const SelectedIcon =
        iconOptions.find(item => item.name === data.icon)?.component || FaHotel;

    return (
        <div className="category-create">
            <div className="category-create__container">
                <div className="category-create__header">
                    <div>
                        <h1>Chỉnh sửa thông tin danh mục</h1>
                        <p>Chỉnh sửa thông tin danh mục cho các cơ sở lưu trú trên TripNest</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="category-create__content">
                        <div className="category-create__form">
                            <div className="form-card">
                                <div className="form-card__header">
                                    <h2>Thông Tin Danh Mục</h2>
                                    <p>Nhập thông tin cơ bản của danh mục</p>
                                </div>

                                <div className="form-group">
                                    <label>
                                        Tên Danh Mục
                                        <span>*</span>
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: Homestay, Villa, Resort..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Mô Tả</label>

                                    <textarea
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder="Nhập mô tả cho danh mục..."
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Biểu Tượng
                                        <span>*</span>
                                    </label>

                                    <div className="category-icon-options">
                                        {iconOptions.map(item => {
                                            const Icon = item.component || FaHotel;

                                            return (
                                                <button
                                                    type="button"
                                                    key={item.name}
                                                    className={`category-icon-option ${data.icon === item.name ? "active" : ""
                                                        }`}
                                                    onClick={() => handleSelectIcon(item.name)}
                                                >
                                                    <Icon />
                                                    <span>{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
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
                                                        Danh mục được hiển thị trên hệ thống
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
                                                        Danh mục không được sử dụng
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
                                        Cập Nhật
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
                                        <SelectedIcon />
                                    </div>

                                    <div className="category-preview__info">
                                        <h3>
                                            {data.title.trim() || "Tên danh mục"}
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

                                <div className="preview-description">
                                    {data.description.trim() ||
                                        "Mô tả danh mục sẽ được hiển thị tại đây."}
                                </div>

                                <div className="preview-info">
                                    <div>
                                        <span>Chỗ ở liên kết</span>
                                        <strong>{data.quantityAccLinkTo}</strong>
                                    </div>

                                    <div>
                                        <span>Ngày tạo</span>
                                        <strong>{new Date(data.createdAt).toLocaleString()}</strong>
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
