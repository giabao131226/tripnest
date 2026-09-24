import { useState } from "react";
import "../../../assets/css/client/book/book.css";

export default function Book() {

    const [step,setStep] = useState(1);

    return (
        <>
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
                                            <div>
                                                <span>Nhận phòng</span>
                                                <strong>20/10/2026</strong>
                                                <small>14:00</small>
                                            </div>

                                            <div className="booking-date__arrow">
                                                →
                                            </div>

                                            <div>
                                                <span>Trả phòng</span>
                                                <strong>23/10/2026</strong>
                                                <small>12:00</small>
                                            </div>

                                            <div className="booking-date__nights">
                                                <strong>3 đêm</strong>
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
                                            onClick={() => setStep(2)}
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
                                                />
                                            </div>

                                            <div className="booking-input">
                                                <label>
                                                    Số điện thoại <span>*</span>
                                                </label>

                                                <input
                                                    type="text"
                                                    placeholder="Nhập số điện thoại"
                                                />
                                            </div>
                                        </div>

                                        <div className="booking-input">
                                            <label>
                                                Email <span>*</span>
                                            </label>

                                            <input
                                                type="email"
                                                placeholder="Nhập địa chỉ email"
                                            />
                                        </div>

                                        <div className="booking-input">
                                            <label>Ghi chú cho chỗ ở</label>

                                            <textarea
                                                placeholder="Ví dụ: Tôi sẽ nhận phòng muộn..."
                                                rows="4"
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
                                            onClick={() => setStep(3)}
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
                                            className="booking-btn booking-btn--primary"
                                        >
                                            Thanh toán
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
                                        <strong>Villa Ocean View</strong>
                                        <span>Phòng Deluxe</span>
                                    </div>
                                </div>

                                <div className="booking-summary__details">
                                    <div>
                                        <span>Nhận phòng</span>
                                        <strong>20/10/2026</strong>
                                    </div>

                                    <div>
                                        <span>Trả phòng</span>
                                        <strong>23/10/2026</strong>
                                    </div>

                                    <div>
                                        <span>Khách</span>
                                        <strong>2 khách</strong>
                                    </div>

                                    <div>
                                        <span>Phòng</span>
                                        <strong>1 phòng</strong>
                                    </div>
                                </div>

                                <div className="booking-summary__voucher">
                                    <label>Mã giảm giá</label>

                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Nhập mã voucher"
                                        />

                                        <button type="button">
                                            Áp dụng
                                        </button>
                                    </div>
                                </div>

                                <div className="booking-summary__price">
                                    <div>
                                        <span>3 đêm × 1 phòng</span>
                                        <strong>3.000.000đ</strong>
                                    </div>

                                    <div>
                                        <span>Phí dịch vụ</span>
                                        <strong>300.000đ</strong>
                                    </div>

                                    <div>
                                        <span>Giảm giá</span>
                                        <strong>-200.000đ</strong>
                                    </div>
                                </div>

                                <div className="booking-summary__total">
                                    <span>Tổng thanh toán</span>
                                    <strong>3.100.000đ</strong>
                                </div>

                                <div className="booking-summary__secure">
                                    🔒 <span>Thông tin của bạn được bảo mật</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    )
}