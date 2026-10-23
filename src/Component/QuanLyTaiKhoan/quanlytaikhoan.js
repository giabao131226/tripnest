
import { Tag, Image } from "antd";
import { useCallback, useEffect, useState } from "react";
import "./quanlytaikhoan.css";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { GiBeard } from "react-icons/gi";
import { IoMdPerson } from "react-icons/io";
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaBuilding,
    FaFileAlt,
    FaUniversity,
    FaIdCard,
    FaCamera,
    FaArrowUp,
    FaSave
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import SwalAlert from "../SwalAlert/swal-alert";

function QuanLyTaiKhoan() {
    const acc = useSelector(state => state.auth).payload;
    const [dataUpToServer, setDataUpToServer] = useState({ ...acc });
    const [previewAvatar, setPreviewAvatar] = useState(acc.avatar);
    const [previewBL, setPreviewBL] = useState(acc.business_lisence ?? null);
    const dispatch = useDispatch();
    const [sendRequestUpgrade, setSendRequestUpgrade] = useState(false);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        setDataUpToServer({ ...acc });
        setPreviewAvatar(acc.avatar);
        setPreviewBL(acc.business_lisence ?? null);
    }, [acc]);

    useEffect(() => {
        fetch(`${apiUrl}account/send-request-upgrade`,{
            credentials: "include"
        })
            .then(async res => {
                const data = await res.json();
                if(!res.ok || data.success == false) throw new Error(data.message);
                return data;
            }).then(data => {
                if(data.success) setSendRequestUpgrade(data.sendRequestUpgrade);
            }).catch(ex => {
                console.log(ex);
                SwalAlert({
                    "status": "error",
                    "message": ex,
                    "time": 2000
                });
            })
    },[])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setDataUpToServer(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleUpgrade = useCallback(() => {
        const formData = new FormData();

        Object.keys(dataUpToServer).forEach(item => {
            if (dataUpToServer[item] !== undefined && dataUpToServer[item] !== null) {
                formData.append(item, dataUpToServer[item]);
            }
        });

        fetch(`${apiUrl}account/edit/${acc._id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    dispatch({ type: "UPDATE", payload: data.newInfo });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Cập nhật thất bại",
                        text: data.message || "Vui lòng thử lại."
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi kết nối",
                    text: "Không thể cập nhật thông tin vào lúc này."
                });
            });
        if (dataUpToServer.business_lisence && dataUpToServer.tax_code) {
            const dataRequestUpgrade = {
                account_id: dataUpToServer._id,
                business_lisence: dataUpToServer.business_lisence,
                tax_code: dataUpToServer.tax_code,
                bank_account: dataUpToServer.bank_account
            };

            fetch(`${apiUrl}account/request-upgrade-role`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(dataRequestUpgrade)
            })
                .then(async res => {
                    const data = await res.json();
                    if (!res.ok || !data.success) throw new Error(data.message);
                    return data;
                })
                .then(data => {
                    setSendRequestUpgrade(true);
                    SwalAlert({
                        "status": "success",
                        "message": data.message,
                        "time": 2000
                    })
                }).catch(ex => {
                    SwalAlert({
                        "status": "error",
                        "message": ex,
                        "time": 2000
                    })
                });
        } else {
            SwalAlert({
                "status": "error",
                "message": "Bạn phải nhập đầy đủ thông tin yêu cầu",
                "time": 2000
            })
        }
    }, [dataUpToServer, acc._id, dispatch]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const formData = new FormData();

        Object.keys(dataUpToServer).forEach(item => {
            if (dataUpToServer[item] !== undefined && dataUpToServer[item] !== null) {
                formData.append(item, dataUpToServer[item]);
            }
        });

        fetch(`${apiUrl}account/edit/${acc._id}`, {
            method: "PATCH",
            credentials: "include",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    dispatch({ type: "UPDATE", payload: data.newInfo });

                    Swal.fire({
                        icon: "success",
                        title: "Cập nhật thành công!",
                        text: "Thông tin tài khoản của bạn đã được cập nhật.",
                        showConfirmButton: false,
                        timer: 2000,
                        toast: true,
                        position: "top-end"
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Cập nhật thất bại",
                        text: data.message || "Vui lòng thử lại."
                    });
                }
            })
            .catch(() => {
                Swal.fire({
                    icon: "error",
                    title: "Lỗi kết nối",
                    text: "Không thể cập nhật thông tin vào lúc này."
                });
            });
    }, [dataUpToServer, acc._id, dispatch]);

    const handleChangeImage = useCallback((e) => {
        const { name, files } = e.target;

        if (!files || !files[0]) return;

        const file = files[0];
        const url = URL.createObjectURL(file);

        if (name === "avatar") {
            setPreviewAvatar(url);
        } else {
            setPreviewBL(url);
        }

        setDataUpToServer(prev => ({ ...prev, [name]: file }));
    }, []);

    const roleInfo = {
        owner: {
            label: "Chủ cơ sở",
            color: "blue",
            icon: <GiBeard />
        }
    };

    const currentRole = roleInfo[acc.role] || {
        label: "Khách hàng",
        color: "green",
        icon: <IoMdPerson />
    };

    return (
        <main className="qltk">
            <div className="qltk__container">
                <header className="qltk__header">
                    <div>
                        <span className="qltk__eyebrow">TRIPNEST ACCOUNT</span>
                        <h1 className="qltk__title">Quản lý tài khoản</h1>
                        <p className="qltk__subtitle">
                            Quản lý thông tin cá nhân và hồ sơ hoạt động của bạn.
                        </p>
                    </div>
                    <Tag className="qltk__role" color={currentRole.color}>
                        {currentRole.icon}
                        <span>{currentRole.label}</span>
                    </Tag>
                </header>

                <form onSubmit={handleSubmit} className="qltk__form">
                    <section className="qltk__card qltk__profile">
                        <div className="qltk__section-heading">
                            <div className="qltk__section-icon">
                                <FaUser />
                            </div>
                            <div>
                                <h2>Thông tin cá nhân</h2>
                                <p>Cập nhật thông tin cơ bản của tài khoản.</p>
                            </div>
                        </div>

                        <div className="qltk__avatar-section">
                            <div className="qltk__avatar">
                                <img
                                    src={previewAvatar || "https://placehold.co/140x140?text=Avatar"}
                                    alt="Ảnh đại diện"
                                />
                                <label htmlFor="avatar" className="qltk__avatar-edit" title="Đổi ảnh đại diện">
                                    <FaCamera />
                                </label>
                                <input
                                    id="avatar"
                                    name="avatar"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    hidden
                                />
                            </div>
                            <div className="qltk__avatar-info">
                                <h3>Ảnh đại diện</h3>
                                <p>Chọn ảnh rõ nét để mọi người dễ nhận diện bạn.</p>
                                <label htmlFor="avatar" className="qltk__upload-link">
                                    Thay đổi ảnh
                                </label>
                            </div>
                        </div>

                        <div className="qltk__fields">
                            <div className="qltk__field">
                                <label htmlFor="username">
                                    Tên người dùng <span>*</span>
                                </label>
                                <div className="qltk__input-wrap">
                                    <FaUser />
                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        value={dataUpToServer.username ?? ""}
                                        onChange={handleChange}
                                        placeholder="Nhập tên người dùng"
                                    />
                                </div>
                            </div>

                            <div className="qltk__field">
                                <label htmlFor="email">
                                    Email <span>*</span>
                                </label>
                                <div className="qltk__input-wrap">
                                    <FaEnvelope />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={dataUpToServer.email ?? ""}
                                        onChange={handleChange}
                                        placeholder="example@email.com"
                                    />
                                </div>
                            </div>

                            <div className="qltk__field">
                                <label htmlFor="phone">
                                    Số điện thoại <span>*</span>
                                </label>
                                <div className="qltk__input-wrap">
                                    <FaPhone />
                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        value={dataUpToServer.phone ?? ""}
                                        onChange={handleChange}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="qltk__card qltk__business">
                        <div className="qltk__section-heading">
                            <div className="qltk__section-icon qltk__section-icon--business">
                                <FaBuilding />
                            </div>
                            <div>
                                <h2>Hồ sơ chủ cơ sở</h2>
                                <p>Thông tin cần thiết để quản lý cơ sở lưu trú.</p>
                            </div>
                        </div>

                        <div className="qltk__license">
                            <div className="qltk__license-heading">
                                <div>
                                    <h3>Giấy phép kinh doanh</h3>
                                    <p>Tải lên hình ảnh giấy phép kinh doanh của bạn.</p>
                                </div>
                                <label htmlFor="imageBusinessLisence" className="qltk__upload-button">
                                    <FaCamera />
                                    <span>Tải ảnh lên</span>
                                </label>
                            </div>

                            <input
                                onChange={handleChangeImage}
                                id="imageBusinessLisence"
                                type="file"
                                name="business_lisence"
                                accept="image/*"
                                hidden
                            />

                            {previewBL ? (
                                <div className="qltk__license-preview">
                                    <Image
                                        src={previewBL}
                                        alt="Giấy phép kinh doanh"
                                        className="qltk__license-image"
                                    />
                                </div>
                            ) : (
                                <label htmlFor="imageBusinessLisence" className="qltk__upload-area">
                                    <FaFileAlt />
                                    <strong>Chưa có giấy phép kinh doanh</strong>
                                    <span>Nhấn để chọn ảnh từ thiết bị</span>
                                </label>
                            )}
                        </div>

                        <div className="qltk__fields">
                            <div className="qltk__field">
                                <label htmlFor="tax_code">Mã số thuế</label>
                                <div className="qltk__input-wrap">
                                    <FaIdCard />
                                    <input
                                        id="tax_code"
                                        name="tax_code"
                                        type="text"
                                        value={dataUpToServer.tax_code ?? ""}
                                        onChange={handleChange}
                                        placeholder="Nhập mã số thuế"
                                    />
                                </div>
                            </div>

                            <div className="qltk__field">
                                <label htmlFor="stk">Tài khoản ngân hàng</label>
                                <div className="qltk__input-wrap">
                                    <FaUniversity />
                                    <input
                                        id="stk"
                                        name="stk"
                                        type="text"
                                        value={dataUpToServer.stk ?? ""}
                                        onChange={handleChange}
                                        placeholder="Nhập số tài khoản"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {acc.role !== "owner" && (
                        <section className="qltk__upgrade">
                            <div className="qltk__upgrade-icon">
                                <FaBuilding />
                            </div>
                            {!sendRequestUpgrade ? (
                                <>
                                    <div className="qltk__upgrade-content">
                                        <h2>Trở thành đối tác TripNest</h2>
                                        <p>
                                            Hoàn thiện hồ sơ để bắt đầu đăng tải và quản lý
                                            cơ sở lưu trú của bạn trên TripNest.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="qltk__upgrade-button"
                                        onClick={handleUpgrade}
                                    >
                                        <FaArrowUp />
                                        <span>Yêu cầu nâng cấp</span>
                                    </button>
                                </>
                            ) : (
                                <div className="qltk__upgrade-content qltk__upgrade-content--pending">
                                    <h2>Đã gửi yêu cầu nâng cấp</h2>
                                    <p>
                                        Yêu cầu nâng cấp tài khoản của bạn đã được gửi thành công.
                                        Vui lòng chờ tối đa 3 ngày để TripNest kiểm tra và đối chiếu
                                        thông tin.
                                    </p>
                                    <p className="qltk__upgrade-notice">
                                        <strong>Lưu ý:</strong> Vui lòng không cập nhật hoặc thay đổi
                                        thông tin hồ sơ trong thời gian chờ xét duyệt để chúng tôi
                                        thực hiện đối chiếu chính xác.
                                    </p>
                                </div>
                            )}
                        </section>
                    )}

                    <footer className="qltk__footer">
                        <p>Hãy đảm bảo thông tin của bạn luôn chính xác và cập nhật.</p>
                        <button type="submit" className="qltk__save-button">
                            <FaSave />
                            <span>Lưu thay đổi</span>
                        </button>
                    </footer>
                </form>
            </div>
        </main>
    );
}

export default QuanLyTaiKhoan;
