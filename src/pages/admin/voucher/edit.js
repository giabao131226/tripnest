import { useState, useEffect, useCallback } from "react";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import { useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/admin/category/create.css";
import "../../../assets/css/admin/vouchers/create.css";
import { validateVoucher } from "../../../helper/validatedVoucher";
import { FaSearch } from "react-icons/fa";

export default function EditVoucher() {
    const params = useParams();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [data, setData] = useState({
        code: "",
        name: "",
        description: "",
        discount_type: "percent",
        discount_value: "",
        max_discount: "",
        min_order_value: 0,
        quantity: "",
        apply_scope: "all",
        user_ids: [],
        start_date: "",
        end_date: "",
        status: "active"
    });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleUserChange = useCallback((e) => {
        const { value, checked } = e.target;

        setData(prev => ({
            ...prev,
            user_ids: checked
                ? [...prev.user_ids, value]
                : prev.user_ids.filter(id => id !== value)
        }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const error = validateVoucher(data);

        if (error) {
            SwalAlert({
                status: "error",
                time: 2000,
                message: error
            });
            return;
        }

        const payload = {
            code: data.code.trim().toUpperCase(),
            name: data.name.trim(),
            description: data.description.trim(),
            discount_type: data.discount_type,
            discount_value: Number(data.discount_value),
            max_discount: data.max_discount === ""
                ? null
                : Number(data.max_discount),
            min_order_value: Number(data.min_order_value),
            quantity: Number(data.quantity),
            apply_scope: data.apply_scope,
            user_ids: data.apply_scope === "specific_users"
                ? data.user_ids
                : [],
            start_date: data.start_date,
            end_date: data.end_date,
            status: data.status
        };

        fetch(`${apiUrl}admin/vouchers/edit/${params.code}`, {
            method: "PUT",
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
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, data, params.code]);

    useEffect(() => {
        fetch(`${apiUrl}admin/vouchers/detail/${params.code}`, {
            method: "GET",
            credentials: "include"
        })
            .then(async res => {
                const result = await res.json();
                if (!res.ok || !result?.success) {
                    throw new Error(result?.message);
                }
                return result;
            })
            .then(result => {
                console.log(result);
                if (result.success) {
                    const voucher = result.detail;
                    setData({
                        code: voucher.code || "",
                        name: voucher.name || "",
                        description: voucher.description || "",
                        discount_type: voucher.discount_type || "percent",
                        discount_value: voucher.discount_value ?? "",
                        max_discount: voucher.max_discount ?? "",
                        min_order_value: voucher.min_order_value ?? 0,
                        quantity: voucher.quantity ?? "",
                        apply_scope: voucher.apply_scope || "all",
                        user_ids: voucher.user_ids || [],
                        start_date: voucher.start_date
                            ? new Date(voucher.start_date).toISOString().slice(0, 16)
                            : "",
                        end_date: voucher.end_date
                            ? new Date(voucher.end_date).toISOString().slice(0, 16)
                            : "",
                        status: voucher.status || "active"
                    });
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, params.code]);

    useEffect(() => {
        if (data.apply_scope !== "specific_users") {
            return;
        }

        fetch(`${apiUrl}admin/user/all`, {
            credentials: "include"
        })
            .then(async res => {
                const result = await res.json();
                if (!res.ok || !result?.success) {
                    throw new Error(result?.message);
                }
                return result;
            })
            .then(result => {
                setUsers(result.users || []);
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            });
    }, [apiUrl, data.apply_scope]);

    return (
        <div className="category-create">
            <div className="category-create__container">
                <div className="category-create__header">
                    <div>
                        <h1>Chỉnh sửa Voucher</h1>
                        <p>
                            Cập nhật thông tin và cấu hình voucher trên TripNest
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="category-create__content">
                        <div className="category-create__section">
                            <div className="category-create__section-header">
                                <h2>Thông Tin Voucher</h2>
                                <p>Thông tin cơ bản của voucher</p>
                            </div>

                            <div className="category-create__form">
                                <div className="category-create__form-group">
                                    <label>
                                        Mã Voucher <span>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="code"
                                        value={data.code}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: TRIPNEST20"
                                    />
                                    <small>
                                        Mã voucher được sử dụng khi đặt phòng
                                    </small>
                                </div>

                                <div className="category-create__form-group">
                                    <label>
                                        Tên Voucher <span>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleChange}
                                        placeholder="Ví dụ: Giảm 20% kỳ nghỉ"
                                    />
                                </div>

                                <div className="category-create__form-group">
                                    <label>Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={data.description}
                                        onChange={handleChange}
                                        placeholder="Nhập mô tả cho voucher..."
                                        rows="4"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="category-create__section">
                            <div className="category-create__section-header">
                                <h2>Thông Tin Giảm Giá</h2>
                                <p>Cấu hình giá trị và điều kiện giảm giá</p>
                            </div>

                            <div className="category-create__form category-create__form--grid">
                                <div className="category-create__form-group">
                                    <label>
                                        Loại giảm giá <span>*</span>
                                    </label>
                                    <select
                                        name="discount_type"
                                        value={data.discount_type}
                                        onChange={handleChange}
                                    >
                                        <option value="percent">
                                            Giảm theo phần trăm
                                        </option>
                                        <option value="fixed">
                                            Giảm số tiền cố định
                                        </option>
                                    </select>
                                </div>

                                <div className="category-create__form-group">
                                    <label>
                                        Giá trị giảm <span>*</span>
                                    </label>
                                    <div className="category-create__input-unit">
                                        <input
                                            type="number"
                                            name="discount_value"
                                            value={data.discount_value}
                                            onChange={handleChange}
                                            placeholder="Nhập giá trị"
                                            min="0"
                                        />
                                        <span>
                                            {data.discount_type === "percent"
                                                ? "%"
                                                : "VNĐ"}
                                        </span>
                                    </div>
                                </div>

                                <div className="category-create__form-group">
                                    <label>Giảm tối đa</label>
                                    <div className="category-create__input-unit">
                                        <input
                                            type="number"
                                            name="max_discount"
                                            value={data.max_discount}
                                            onChange={handleChange}
                                            placeholder="Không giới hạn"
                                            min="0"
                                        />
                                        <span>VNĐ</span>
                                    </div>
                                    <small>
                                        Áp dụng khi voucher giảm theo phần trăm
                                    </small>
                                </div>

                                <div className="category-create__form-group">
                                    <label>Giá trị đơn hàng tối thiểu</label>
                                    <div className="category-create__input-unit">
                                        <input
                                            type="number"
                                            name="min_order_value"
                                            value={data.min_order_value}
                                            onChange={handleChange}
                                            placeholder="0"
                                            min="0"
                                        />
                                        <span>VNĐ</span>
                                    </div>
                                </div>

                                <div className="category-create__form-group">
                                    <label>
                                        Số lượng voucher <span>*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={data.quantity}
                                        onChange={handleChange}
                                        placeholder="Nhập số lượng"
                                        min="1"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="category-create__section">
                            <div className="category-create__section-header">
                                <h2>Phạm Vi Áp Dụng</h2>
                                <p>
                                    Xác định những thành viên được sử dụng voucher
                                </p>
                            </div>

                            <div className="category-create__form">
                                <div className="category-create__form-group">
                                    <label>
                                        Đối tượng áp dụng <span>*</span>
                                    </label>

                                    <div className="category-create__radio-group">
                                        <label className="category-create__radio">
                                            <input
                                                type="radio"
                                                name="apply_scope"
                                                value="all"
                                                checked={data.apply_scope === "all"}
                                                onChange={handleChange}
                                            />
                                            <div>
                                                <strong>Tất cả thành viên</strong>
                                                <span>
                                                    Voucher có thể được sử dụng bởi tất
                                                    cả thành viên
                                                </span>
                                            </div>
                                        </label>

                                        <label className="category-create__radio">
                                            <input
                                                type="radio"
                                                name="apply_scope"
                                                value="specific_users"
                                                checked={
                                                    data.apply_scope === "specific_users"
                                                }
                                                onChange={handleChange}
                                            />
                                            <div>
                                                <strong>Thành viên được chọn</strong>
                                                <span>
                                                    Chỉ những thành viên được chỉ định
                                                    mới có thể sử dụng voucher
                                                </span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {data.apply_scope === "specific_users" && (
                                    <div className="voucher-add-user d-flex flex-column">
                                        <div className="tool-search">
                                            <FaSearch />
                                            <input
                                                className="col-10"
                                                name="search-user"
                                                placeholder="Nhập email, username"
                                            />
                                        </div>

                                        <div className="py-2"></div>

                                        <div className="d-flex items-center">
                                            <div className="d-flex flex-column gap-y-3">
                                                {users.map(item => (
                                                    <div
                                                        className="d-flex items-center justify-between"
                                                        key={item._id}
                                                    >
                                                        <div className="d-flex items-center gap-x-3">
                                                            <div className="vien-img">
                                                                <img
                                                                    src={item.avatar}
                                                                    alt=""
                                                                />
                                                            </div>

                                                            <span className="font-bold">
                                                                {item.username}
                                                            </span>
                                                        </div>

                                                        <input
                                                            type="checkbox"
                                                            name="user_ids"
                                                            value={item._id}
                                                            checked={data.user_ids.includes(item._id)}
                                                            onChange={handleUserChange}
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="selected-user"></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="category-create__section">
                            <div className="category-create__section-header">
                                <h2>Thời Gian Áp Dụng</h2>
                                <p>Thiết lập thời gian voucher có hiệu lực</p>
                            </div>

                            <div className="category-create__form category-create__form--grid">
                                <div className="category-create__form-group">
                                    <label>
                                        Ngày bắt đầu <span>*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={data.start_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="category-create__form-group">
                                    <label>
                                        Ngày kết thúc <span>*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="end_date"
                                        value={data.end_date}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="category-create__form-group">
                                    <label>Trạng thái</label>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={handleChange}
                                    >
                                        <option value="active">Hoạt động</option>
                                        <option value="inactive">Bị khóa</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="category-create__footer">
                        <button
                            type="button"
                            className="category-create__btn category-create__btn--cancel"
                            onClick={() => navigate(-1)}
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            className="category-create__btn category-create__btn--submit"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}