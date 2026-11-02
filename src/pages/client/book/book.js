import { useCallback, useEffect, useState } from "react";
import { useSelector } from 'react-redux'
import "../../../assets/css/client/book/book.css";
import { useParams } from "react-router-dom";
import SwalAlert from "../../../Component/SwalAlert/swal-alert";
import FormatMoneyVND from "../../../helper/formatMoneyVND";

export default function Book() {
    const params = useParams();
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [step, setStep] = useState(1);
    const [detailRoom, setDetailRoom] = useState({});
    const [myVouchers, setMyVouchers] = useState([]);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [checkInTime, setCheckInTime] = useState("14:00");
    const [checkOutTime, setCheckOutTime] = useState("12:00");
    const [discount, setDiscount] = useState(0);
    const minDate = new Date().toLocaleDateString("en-CA");
    const totalNights = checkIn && checkOut
        ? Math.max(
            0,
            (new Date(`${checkOut}T00:00:00`) - new Date(`${checkIn}T00:00:00`)) / (1000 * 60 * 60 * 24)
        )
        : 0;
    const serviceFee = (totalNights * detailRoom.price_per_night * detailRoom.service_fee_percent) / 100;
    const totalPrice = totalNights * detailRoom.price_per_night + serviceFee;
    const user = useSelector(state => state.auth).payload;
    const [dataUpToSever, setDataUpToSever] = useState({
        phone: user.phone,
        email: user.email
    });
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [confirmedBooking, setConfirmedBooking] = useState({});
    const [selectedPayment, setSelectedPayment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);



    const handleDiscount = (voucher) => {
        if (voucher.discount_type == "fixed") setDiscount(voucher.discount_value);
        else {
            const dc = ((totalPrice + serviceFee) * voucher.discount_value) / 100;
            setDiscount(dc);
        }
    }

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setDataUpToSever({
            ...dataUpToSever,
            [name]: value
        });
    }, [dataUpToSever])

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        if (!selectedPayment) {
            SwalAlert({
                status: "error",
                time: 2000,
                message: "Vui lòng chọn phương thức thanh toán!"
            });
            return;
        }

        const payload = {
            ...dataUpToSever,
            total_nights: totalNights,
            service_fee_percent: detailRoom.service_fee_percent,
            title: detailRoom.title,
            accommodation_unit_id: detailRoom._id,
            price_per_night: detailRoom.price_per_night,
            total_price: totalPrice - discount,
            check_in: new Date(`${checkIn}T${checkInTime}:00`),
            check_out: new Date(`${checkOut}T${checkOutTime}:00`),
            payment_method: selectedPayment
        };

        setIsSubmitting(true);

        fetch(`${apiUrl}accommodation-unit/book`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(payload)
        })
            .then(async res => {
                const data = await res.json();
                if (!res.ok || data.success === false) {
                    throw new Error(data.message);
                }
                return data;
            })
            .then(data => {
                if (data.success) {
                    setConfirmedBooking({
                        ...payload,
                        ...(data.booking || {}),
                        booking_id: data.booking?._id || data.booking?.booking_id || data.booking_id
                    });
                    setBookingSuccess(true);
                }
            })
            .catch(ex => {
                SwalAlert({
                    status: "error",
                    time: 2000,
                    message: ex.message
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    }, [
        dataUpToSever,
        totalNights,
        detailRoom,
        totalPrice,
        discount,
        checkIn,
        checkOut,
        checkInTime,
        checkOutTime,
        selectedPayment,
        apiUrl
    ]);

    useEffect(() => {
        fetch(`${apiUrl}vouchers/my-voucher/all`, {
            credentials: "include"
        }).then(async res => {
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message);
            return data;
        }).then(data => {
            if (data.success) {
                setMyVouchers(data.vouchers.filter(voucher => voucher !== null));
            }
        }).catch(ex => {
            SwalAlert({
                "status": "error",
                "time": 2000,
                "message": ex
            });
        })
    }, [])

    useEffect(() => {
        fetch(`${apiUrl}accommodation-unit/detail/${params.id}`)
            .then(async res => {
                const data = await res.json();
                if (!res.ok || data.success == false) throw new Error(data.message);
                return data;
            }).then(data => {
                if (data.success) {
                    setDetailRoom(data.detail);
                }
            }).catch(ex => {
                SwalAlert({
                    "status": "error",
                    "time": 2000,
                    "message": ex
                })
            })
    }, [])

    return (
        <>
            return (
    <>
        {bookingSuccess ? (
            <div className="booking-success">
                <div className="booking-success__container">
                    <div className="booking-success__header">
                        <div className="booking-success__icon">
                            <span>✓</span>
                        </div>
                        <h1>Đặt phòng thành công!</h1>
                        <p>
                            Cảm ơn bạn đã lựa chọn TripNest.
                            Đơn đặt phòng của bạn đã được ghi nhận.
                        </p>
                        <div className="booking-success__code">
                            Mã đặt phòng:
                            <strong>
                                {confirmedBooking.booking_code ||
                                    confirmedBooking.booking_id ||
                                    confirmedBooking._id ||
                                    "Đã xác nhận"}
                            </strong>
                        </div>
                    </div>

                    <div className="booking-success__content">
                        <div className="booking-success__section">
                            <h2>Thông tin chỗ ở</h2>

                            <div className="booking-success__room">
                                <img
                                    src={detailRoom.images?.[0]?.url || detailRoom.images?.[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a"}
                                    alt={detailRoom.title}
                                />
                                <div>
                                    <h3>{confirmedBooking.title || detailRoom.title}</h3>
                                    <p>{detailRoom.titleAcc}</p>
                                </div>
                            </div>

                            <div className="booking-success__grid">
                                <div>
                                    <span>Nhận phòng</span>
                                    <strong>
                                        {new Date(confirmedBooking.check_in).toLocaleString("vi-VN")}
                                    </strong>
                                </div>
                                <div>
                                    <span>Trả phòng</span>
                                    <strong>
                                        {new Date(confirmedBooking.check_out).toLocaleString("vi-VN")}
                                    </strong>
                                </div>
                                <div>
                                    <span>Thời gian lưu trú</span>
                                    <strong>{confirmedBooking.total_nights} đêm</strong>
                                </div>
                                <div>
                                    <span>Số lượng phòng</span>
                                    <strong>1 phòng</strong>
                                </div>
                            </div>
                        </div>

                        <div className="booking-success__section">
                            <h2>Thông tin khách hàng</h2>

                            <div className="booking-success__grid">
                                <div>
                                    <span>Họ và tên</span>
                                    <strong>{confirmedBooking.guest_name}</strong>
                                </div>
                                <div>
                                    <span>Số điện thoại</span>
                                    <strong>{confirmedBooking.phone}</strong>
                                </div>
                                <div>
                                    <span>Email</span>
                                    <strong>{confirmedBooking.email}</strong>
                                </div>
                                <div>
                                    <span>Phương thức thanh toán</span>
                                    <strong>{confirmedBooking.payment_method}</strong>
                                </div>
                            </div>

                            {confirmedBooking.note && (
                                <div className="booking-success__note">
                                    <span>Ghi chú</span>
                                    <p>{confirmedBooking.note}</p>
                                </div>
                            )}
                        </div>

                        <div className="booking-success__section">
                            <h2>Chi tiết thanh toán</h2>

                            <div className="booking-success__price">
                                <div>
                                    <span>Tiền phòng</span>
                                    <strong>
                                        {FormatMoneyVND(
                                            confirmedBooking.price_per_night *
                                            confirmedBooking.total_nights
                                        )}đ
                                    </strong>
                                </div>

                                <div>
                                    <span>Phí dịch vụ</span>
                                    <strong>
                                        {FormatMoneyVND(
                                            Math.round(
                                                confirmedBooking.price_per_night *
                                                confirmedBooking.total_nights *
                                                confirmedBooking.service_fee_percent / 100
                                            )
                                        )}đ
                                    </strong>
                                </div>

                                <div>
                                    <span>Giảm giá</span>
                                    <strong>
                                        -{FormatMoneyVND(discount)}đ
                                    </strong>
                                </div>

                                <div className="booking-success__total">
                                    <span>Tổng thanh toán</span>
                                    <strong>
                                        {FormatMoneyVND(confirmedBooking.totalPrice)}đ
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="booking-success__actions">
                        <button
                            onClick={() => window.location.href = "/"}
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        ) : (
                        <div className="book-room">
                            <div className="book-room__container">
                                <div className="book-room__header">
                                    <button className="book-room__back">
                                        ← Quay lại chỗ ở
                                    </button>

                                    <div className="book-room__title">
                                        <h2>Xác nhận & Thanh toán</h2>
                                        <span>Hoàn tất đặt chỗ cho kỳ nghỉ của bạn</span>
                                    </div>

                                    <span className="book-room__security">
                                        🔒 Bảo mật SSL 256-bit
                                    </span>
                                </div>

                                <hr />

                                <div className="book-room__steps">
                                    <div className={`book-room__step ${step >= 1 ? "active" : ""}`}>
                                        <span className="book-room__step-number">1</span>
                                        <div>
                                            <strong>Chi tiết chuyến đi</strong>
                                            <small>Thời gian, khách & phòng</small>
                                        </div>
                                    </div>

                                    <div className="book-room__step-line"></div>

                                    <div className={`book-room__step ${step >= 2 ? "active" : ""}`}>
                                        <span className="book-room__step-number">2</span>
                                        <div>
                                            <strong>Thông tin khách hàng</strong>
                                            <small>Thông tin người đặt</small>
                                        </div>
                                    </div>

                                    <div className="book-room__step-line"></div>

                                    <div className={`book-room__step ${step >= 3 ? "active" : ""}`}>
                                        <span className="book-room__step-number">3</span>
                                        <div>
                                            <strong>Thanh toán</strong>
                                            <small>Phương thức thanh toán</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="book-room__content">
                                    <div className="book-room__main">
                                        {step === 1 && (
                                            <div className="booking-form">
                                                <div className="booking-form__header">
                                                    <h2>Chi tiết chuyến đi</h2>
                                                    <p>Kiểm tra lại thông tin chuyến đi của bạn</p>
                                                </div>

                                                <div className="booking-section">
                                                    <h3>Thời gian lưu trú</h3>

                                                    <div className="booking-date">
                                                        <div className="booking-date__input">
                                                            <span>Nhận phòng</span>
                                                            <input
                                                                type="date"
                                                                value={checkIn}
                                                                min={minDate}
                                                                onChange={(e) => {
                                                                    setCheckIn(e.target.value);
                                                                    if (checkOut && e.target.value >= checkOut) {
                                                                        setCheckOut("");
                                                                    }
                                                                }}
                                                            />
                                                            <input
                                                                type="time"
                                                                value={checkInTime}
                                                                onChange={(e) => setCheckInTime(e.target.value)}
                                                            />
                                                        </div>

                                                        <div className="booking-date__arrow">→</div>

                                                        <div className="booking-date__input">
                                                            <span>Trả phòng</span>
                                                            <input
                                                                type="date"
                                                                value={checkOut}
                                                                min={checkIn || minDate}
                                                                disabled={!checkIn}
                                                                onChange={(e) => setCheckOut(e.target.value)}
                                                            />
                                                            <input
                                                                type="time"
                                                                value={checkOutTime}
                                                                onChange={(e) => setCheckOutTime(e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-section">
                                                    <h3>Khách & phòng</h3>

                                                    <div className="booking-guests">
                                                        <div>
                                                            <span>Phòng</span>
                                                            <strong>1 phòng</strong>
                                                        </div>

                                                        <div>
                                                            <span>Người lớn</span>
                                                            <strong>2 khách</strong>
                                                        </div>

                                                        <div>
                                                            <span>Trẻ em</span>
                                                            <strong>0 trẻ em</strong>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-section">
                                                    <h3>Chính sách hủy phòng</h3>

                                                    <div className="booking-policy">
                                                        <span className="booking-policy__icon">✓</span>

                                                        <div>
                                                            <strong>Hủy miễn phí</strong>
                                                            <p>
                                                                Bạn có thể hủy miễn phí trước ngày
                                                                18/10/2026.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="booking-form__actions">
                                                    <button
                                                        type="button"
                                                        className="booking-btn booking-btn--primary"
                                                        onClick={() => {
                                                            if (checkIn && checkOut) setStep(2)
                                                            else SwalAlert({ "status": "error", "message": "Vui lòng chọn thời gian check in và check out", "time": 2000 })
                                                        }}
                                                    >
                                                        Tiếp tục
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className="booking-form">
                                                <div className="booking-form__header">
                                                    <h2>Thông tin khách hàng</h2>
                                                    <p>
                                                        Nhập thông tin người đại diện cho đặt phòng
                                                    </p>
                                                </div>

                                                <div className="booking-section">
                                                    <div className="booking-input-row">
                                                        <div className="booking-input">
                                                            <label>
                                                                Họ và tên <span>*</span>
                                                            </label>

                                                            <input
                                                                type="text"
                                                                placeholder="Nhập họ và tên"
                                                                name="guest_name"
                                                                required
                                                                onChange={handleChange}
                                                            />
                                                        </div>

                                                        <div className="booking-input">
                                                            <label>
                                                                Số điện thoại <span>*</span>
                                                            </label>

                                                            <input
                                                                type="text"
                                                                name="phone"
                                                                placeholder="Nhập số điện thoại"
                                                                value={dataUpToSever.phone}
                                                                onChange={handleChange}
                                                                required
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="booking-input">
                                                        <label>
                                                            Email <span>*</span>
                                                        </label>

                                                        <input
                                                            type="email"
                                                            name="email"
                                                            value={dataUpToSever.email}
                                                            onChange={handleChange}
                                                            placeholder="Nhập địa chỉ email"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="booking-input">
                                                        <label>Ghi chú cho chỗ ở</label>

                                                        <textarea
                                                            placeholder="Ví dụ: Tôi sẽ nhận phòng muộn..."
                                                            rows="4"
                                                            name="note"
                                                            onChange={handleChange}
                                                        ></textarea>
                                                    </div>
                                                </div>

                                                <div className="booking-form__actions">
                                                    <button
                                                        type="button"
                                                        className="booking-btn booking-btn--secondary"
                                                        onClick={() => setStep(1)}
                                                    >
                                                        Quay lại
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="booking-btn booking-btn--primary"
                                                        onClick={() => {
                                                            if (dataUpToSever.guest_name && dataUpToSever.phone && dataUpToSever.email) {
                                                                setStep(3);
                                                            } else {
                                                                SwalAlert({
                                                                    status: "error",
                                                                    message: "Bạn phải nhập đầy đủ thông tin trước",
                                                                    "time": 2000
                                                                })
                                                            }
                                                        }}
                                                    >
                                                        Tiếp tục
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className="booking-form">
                                                <div className="booking-form__header">
                                                    <h2>Phương thức thanh toán</h2>
                                                    <p>Chọn phương thức thanh toán cho đặt phòng</p>
                                                </div>

                                                <div className="booking-payment">
                                                    <label className="booking-payment__option">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value="momo"
                                                            checked={selectedPayment === "momo"}
                                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                                        />

                                                        <div>
                                                            <strong>Ví điện tử</strong>
                                                            <span>
                                                                Thanh toán thông qua ví điện tử
                                                            </span>
                                                        </div>
                                                    </label>

                                                    <label className="booking-payment__option">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value="bank"
                                                            checked={selectedPayment === "bank"}
                                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                                        />

                                                        <div>
                                                            <strong>Chuyển khoản ngân hàng</strong>
                                                            <span>
                                                                Thanh toán qua tài khoản ngân hàng
                                                            </span>
                                                        </div>
                                                    </label>

                                                    <label className="booking-payment__option">
                                                        <input
                                                            type="radio"
                                                            name="payment"
                                                            value="cash"
                                                            checked={selectedPayment === "cash"}
                                                            onChange={(e) => setSelectedPayment(e.target.value)}
                                                        />

                                                        <div>
                                                            <strong>Thanh toán tại chỗ</strong>
                                                            <span>
                                                                Thanh toán trực tiếp tại cơ sở lưu trú
                                                            </span>
                                                        </div>
                                                    </label>
                                                </div>

                                                <div className="booking-payment__notice">
                                                    <strong>🔒 Thanh toán an toàn</strong>
                                                    <p>
                                                        Thông tin thanh toán của bạn được bảo mật
                                                        trong suốt quá trình giao dịch.
                                                    </p>
                                                </div>

                                                <div className="booking-form__actions">
                                                    <button
                                                        type="button"
                                                        className="booking-btn booking-btn--secondary"
                                                        onClick={() => setStep(2)}
                                                    >
                                                        Quay lại
                                                    </button>

                                                    <button
                                                        type="submit"
                                                        onClick={handleSubmit}
                                                        disabled={isSubmitting}
                                                        className="booking-btn booking-btn--primary"
                                                    >
                                                        {isSubmitting ? "Đang xử lý..." : "Thanh toán"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="book-room__sidebar">
                                        <div className="booking-summary">
                                            <div className="booking-summary__header">
                                                <h2>Thông tin đặt phòng</h2>
                                            </div>

                                            <div className="booking-summary__room">
                                                <img
                                                    src="https://images.unsplash.com/photo-1566665797739-1674de7a421a"
                                                    alt="Phòng nghỉ"
                                                />

                                                <div>
                                                    <strong>{detailRoom.titleAcc}</strong>
                                                    <span>{detailRoom.title}</span>
                                                </div>
                                            </div>

                                            <div className="booking-summary__details">
                                                <div>
                                                    <span>Nhận phòng</span>
                                                    <strong>{new Date(checkIn).toLocaleDateString("vi-VN")}</strong>
                                                </div>

                                                <div>
                                                    <span>Trả phòng</span>
                                                    <strong>{new Date(checkOut).toLocaleDateString("vi-VN")}</strong>
                                                </div>

                                                <div>
                                                    <span>Số Khách Tối Đa</span>
                                                    <strong>{detailRoom.max_guests} khách</strong>
                                                </div>

                                                <div>
                                                    <span>Phòng</span>
                                                    <strong>1 phòng</strong>
                                                </div>
                                            </div>

                                            <div className="booking-summary__voucher">
                                                <label>Mã giảm giá</label>

                                                <div className="booking-voucher__input">
                                                    <input
                                                        type="text"
                                                        placeholder="Nhập mã voucher"
                                                    />

                                                    <button type="button">
                                                        Áp dụng
                                                    </button>
                                                </div>

                                                <div className="booking-voucher__list">
                                                    <div className="booking-voucher__list-header">
                                                        <strong>Voucher của bạn</strong>
                                                        <span>{myVouchers.length} mã khả dụng</span>
                                                    </div>
                                                    {myVouchers.length > 0 ? myVouchers.map((voucher) => <label className="booking-voucher__item">
                                                        <input
                                                            disabled={totalNights * detailRoom.price_per_night < voucher.min_order_value}
                                                            type="radio" name="bookingVoucher"
                                                            onClick={() => { handleDiscount(voucher) }} />

                                                        <div className="booking-voucher__icon">
                                                            🎟️
                                                        </div>

                                                        <div className="booking-voucher__info">
                                                            <div className="booking-voucher__top">
                                                                <strong>{voucher?.code}</strong>
                                                                <span>{voucher?.name}</span>
                                                            </div>

                                                            <p>{voucher.description}</p>
                                                            <small>Đơn tối thiểu {FormatMoneyVND(voucher?.min_order_value)}đ</small>
                                                            <small>Giảm tối đa {FormatMoneyVND(voucher?.max_discount)}đ</small>
                                                            <small className="booking-voucher__expiry">
                                                                Hạn sử dụng: {new Date(voucher?.end_date).toLocaleDateString("vi-VN")}
                                                            </small>
                                                        </div>
                                                    </label>)

                                                        : <h1>Không có voucher nào khả dụng</h1>}
                                                </div>
                                            </div>

                                            <div className="booking-summary__price">
                                                <div>
                                                    <span>{totalNights} đêm × 1 phòng</span>
                                                    <strong>{FormatMoneyVND(totalNights * detailRoom["price_per_night"])}</strong>
                                                </div>

                                                <div>
                                                    <span>Phí dịch vụ</span>
                                                    <strong>
                                                        {FormatMoneyVND(Math.round(
                                                            (detailRoom.service_fee_percent * totalNights * detailRoom.price_per_night) / 100
                                                        ))}đ
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span>Giảm giá</span>
                                                    <strong>-{FormatMoneyVND(discount)}đ</strong>
                                                </div>
                                            </div>

                                            <div className="booking-summary__total">
                                                <span>Tổng thanh toán</span>
                                                <strong>{FormatMoneyVND(totalPrice - discount)}đ</strong>
                                            </div>

                                            <div className="booking-summary__secure">
                                                🔒 <span>Thông tin của bạn được bảo mật</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
        )}
    </>
);
            
        </>
    )
}