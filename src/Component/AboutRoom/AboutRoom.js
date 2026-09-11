import { Rate, Tag, Button, Modal, Form, Input, DatePicker, message, Select, QRCode, Image } from "antd";
import "./AboutRoom.css"
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const { RangePicker } = DatePicker;

function AboutRoom({ data, disableButton, setDisable }) {
    console.log(data);
    const [messageApi, contextHolder] = message.useMessage()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [acc, setAcc] = useState(JSON.parse(localStorage.getItem("user")))
    const [form] = Form.useForm();
    const params = useParams();
    const [pttt, setPTTT] = useState("trucTiep")
    const checkModal = () => {
        if (document.cookie != "") setIsModalOpen(true);
        else {
            messageApi.open({
                "type": "error",
                "content": "Xin vui lòng đăng nhập tài khoản để đặt được phòng!"
            })
        }
    }

    useEffect(() => {
        setDisable(data.trangThai)
        fetch("https://servertripnest-4.onrender.com/api/taiKhoan?" + document.cookie)
            .then(res => res.json())
            .then(data => {
                setAcc(data[0])
            });
    }, [])
    useEffect(() => {
        if (acc) {
            form.setFieldsValue({
                phone: acc.phone,
                email: acc.email
            });
        }
    }, [acc, form]);
    return (
        <>
            {contextHolder}
            <div className="aboutroom">
                <div className="aboutroom__container">
                    <div className="aboutroom__header">
                        <div className="aboutroom__header-left">
                            <div className="aboutroom__badges">
                                {data.category_id?.title && (
                                    <Tag>{data.category_id.title}</Tag>
                                )}

                                {data.is_guest_favorite && (
                                    <span className="aboutroom__favorite">
                                        Được khách yêu thích
                                    </span>
                                )}
                            </div>

                            <h1>{data.name}</h1>

                            <div className="aboutroom__location">
                                <span>📍</span>
                                <span>{data.address}</span>
                            </div>
                        </div>

                        <div className="aboutroom__header-right">
                            <div className="aboutroom__rating">
                                <div>
                                    <strong>{data.rateper10}/10</strong>
                                    <span>Tuyệt vời</span>
                                </div>

                                <div className="aboutroom__rating-box">
                                    <span>{data.rate}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="aboutroom__content">
                        <div className="aboutroom__main">
                            <section className="aboutroom__section">
                                <h2>Giới thiệu</h2>

                                {data.description && (
                                    <div
                                        className="aboutroom__description"
                                        dangerouslySetInnerHTML={{
                                            __html: data.description
                                        }}
                                    />
                                )}
                            </section>

                            <section className="aboutroom__section">
                                <h2>Tiện nghi</h2>

                                <div className="aboutroom__amenities">
                                    {data.amenityIds?.map((item) => (
                                        <div
                                            className="aboutroom__amenity"
                                            key={item._id}
                                        >
                                            <i className={item.icon}></i>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="aboutroom__section aboutroom__accommodations">
                                <div className="aboutroom__section-title">
                                    <div>
                                        <h2>Các đơn vị lưu trú</h2>

                                        <p>
                                            Lựa chọn phòng hoặc căn lưu trú phù hợp với nhu cầu của bạn
                                        </p>
                                    </div>
                                </div>

                                <div className="aboutroom__accommodation-list">
                                    {data.accommodationUnits?.map((item) => (
                                        <div
                                            className="accommodation-card"
                                            key={item._id}
                                        >
                                            {item.images?.length > 0 && (
                                                <div className="accommodation-card__images">
                                                    <div className="accommodation-card__image-list">
                                                        {item.images.map((image, index) => (
                                                            <div
                                                                className="accommodation-card__image"
                                                                key={index}
                                                            >
                                                                <Image
                                                                    src={
                                                                        typeof image === "string"
                                                                            ? image
                                                                            : image.url
                                                                    }
                                                                    alt={item.title}
                                                                    preview
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="accommodation-card__top">
                                                <div className="accommodation-card__info">
                                                    <div className="accommodation-card__title-row">
                                                        <h3>{item.title}</h3>

                                                        {item.is_guest_favorite && (
                                                            <span className="accommodation-card__favorite">
                                                                Được khách yêu thích
                                                            </span>
                                                        )}
                                                    </div>

                                                    {item.description && (
                                                        <div
                                                            className="accommodation-card__description"
                                                            dangerouslySetInnerHTML={{
                                                                __html: item.description
                                                            }}
                                                        />
                                                    )}

                                                    <div className="accommodation-card__details">
                                                        <span>
                                                            <i className="fa-solid fa-ruler-combined"></i>
                                                            {item.room_size || 0} m²
                                                        </span>

                                                        <span>
                                                            <i className="fa-solid fa-user-group"></i>
                                                            Tối đa {item.max_guests || 0} khách
                                                        </span>

                                                        <span>
                                                            <i className="fa-solid fa-bed"></i>
                                                            {item.beds_count || 0} giường
                                                        </span>

                                                        <span>
                                                            <i className="fa-solid fa-door-open"></i>
                                                            {item.bedrooms_count || 0} phòng ngủ
                                                        </span>

                                                        <span>
                                                            <i className="fa-solid fa-bath"></i>
                                                            {item.bathrooms_count || 0} phòng tắm
                                                        </span>
                                                    </div>

                                                    <div className="accommodation-card__extra-info">
                                                        <div>
                                                            <span className="extra-info-label">
                                                                Tổng số phòng
                                                            </span>

                                                            <strong>
                                                                {item.total_room || 0}
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span className="extra-info-label">
                                                                Số lượng phòng
                                                            </span>

                                                            <strong>
                                                                {item.total_quantity || 0}
                                                            </strong>
                                                        </div>

                                                        <div>
                                                            <span className="extra-info-label">
                                                                Trạng thái
                                                            </span>

                                                            <strong>
                                                                {item.status === "active"
                                                                    ? "Đang hoạt động"
                                                                    : "Ngừng hoạt động"}
                                                            </strong>
                                                        </div>
                                                    </div>

                                                    <div className="accommodation-card__fees">
                                                        {item.cleaning_fee > 0 && (
                                                            <span>
                                                                <i className="fa-solid fa-broom"></i>

                                                                Phí vệ sinh:{" "}

                                                                <strong>
                                                                    {Number(
                                                                        item.cleaning_fee
                                                                    ).toLocaleString("vi-VN")}{" "}
                                                                    VND
                                                                </strong>
                                                            </span>
                                                        )}

                                                        {item.service_fee_percent > 0 && (
                                                            <span>
                                                                <i className="fa-solid fa-percent"></i>

                                                                Phí dịch vụ:{" "}

                                                                <strong>
                                                                    {item.service_fee_percent}%
                                                                </strong>
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="accommodation-card__availability">
                                                        <span>
                                                            Còn {item.total_room || 0} phòng
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="accommodation-card__price">
                                                    <span className="accommodation-card__price-label">
                                                        Giá mỗi đêm
                                                    </span>

                                                    <strong>
                                                        {Number(
                                                            item.price_per_night || 0
                                                        ).toLocaleString("vi-VN")}{" "}
                                                        VND
                                                    </strong>

                                                    {item.cleaning_fee > 0 && (
                                                        <small>
                                                            +{" "}
                                                            {Number(
                                                                item.cleaning_fee
                                                            ).toLocaleString("vi-VN")}{" "}
                                                            VND phí vệ sinh
                                                        </small>
                                                    )}

                                                    {item.service_fee_percent > 0 && (
                                                        <small>
                                                            + {item.service_fee_percent}% phí dịch vụ
                                                        </small>
                                                    )}

                                                    <Button
                                                        onClick={() => checkModal(item)}
                                                        disabled={
                                                            disableButton ||
                                                            item.status !== "active"
                                                        }
                                                    >
                                                        {item.status !== "active"
                                                            ? "Ngừng hoạt động"
                                                            : disableButton
                                                                ? "Đã có người đặt"
                                                                : "Đặt phòng"}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="aboutroom__section">
                                <h2>Vị trí</h2>

                                <p className="aboutroom__address">
                                    📍 {data.address}
                                </p>

                                <div className="aboutroom__map">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29818.11356688405!2d105.78095874033141!3d20.901687857716034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135b2be9c0f60cf%3A0xabb8282347787454!2zTeG7uSBIxrBuZywgVGhhbmggT2FpLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1765525448653!5m2!1svi!2s"
                                        loading="lazy"
                                        allowFullScreen
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </section>
                        </div>

                        <aside className="aboutroom__sidebar">
                            <div className="aboutroom__score-card">
                                <div className="aboutroom__score">
                                    <strong>{data.rateper10}</strong>
                                    <span>/10</span>
                                </div>

                                <h3>
                                    Khách nói gì về kỳ nghỉ của họ
                                </h3>

                                <p>
                                    Đánh giá từ những khách đã từng lưu trú tại cơ sở này.
                                </p>
                            </div>

                            <div className="aboutroom__price-card">
                                <span className="aboutroom__price-label">
                                    Giá từ
                                </span>

                                <strong>
                                    {data.accommodationUnits?.length > 0
                                        ? Number(
                                            Math.min(
                                                ...data.accommodationUnits.map(
                                                    item => item.price_per_night
                                                )
                                            )
                                        ).toLocaleString("vi-VN")
                                        : 0}{" "}
                                    VND
                                </strong>

                                <small>
                                    Giá thấp nhất trong các đơn vị lưu trú
                                </small>

                                <Button
                                    onClick={() => {
                                        document.querySelector(
                                            ".aboutroom__accommodations"
                                        )?.scrollIntoView({
                                            behavior: "smooth"
                                        });
                                    }}
                                >
                                    Xem phòng
                                </Button>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>

        </>
    )
}
export default AboutRoom;