import { Modal } from "antd";
import "./modal-detail.css";
import PreviewImage from "../PreviewImage/preview-image";
export default function ModalDetail({ data, statusModal, onClose }) {
    console.log(data);
    return (
        <>
            <Modal
                open={statusModal}
                onCancel={onClose}
                footer={null}
                width={900}
                centered
            >
                <div className="modal-detail">
                    <div className="modal-detail__image">
                        <PreviewImage images = {data.images}></PreviewImage>
                    </div>

                    <div className="modal-detail__content">
                        <h2>{data.title}</h2>

                        <div className="modal-detail__amenities">
                            {data.amenityIds?.map((item) => (
                                <div
                                    className="amenity-item"
                                    key={item._id}
                                >
                                    <i className={item.icon}></i>
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="modal-detail__info">
                            <div className="modal-detail__info-item">
                                <span>Kích thước phòng</span>
                                <strong>{data.room_size} m²</strong>
                            </div>

                            <div className="modal-detail__info-item">
                                <span>Phí dịch vụ</span>
                                <strong>{data.service_fee_percent}%</strong>
                            </div>

                            <div className="modal-detail__info-item">
                                <span>Khách tối đa</span>
                                <strong>{data.max_guests} người</strong>
                            </div>

                            <div className="modal-detail__info-item">
                                <span>Phòng ngủ</span>
                                <strong>{data.bedrooms_count} phòng</strong>
                            </div>

                            <div className="modal-detail__info-item">
                                <span>Giường</span>
                                <strong>{data.beds_count} giường</strong>
                            </div>
                        </div>

                        {data.description && (
                            <div className="modal-detail__description">
                                <h3>Giới thiệu</h3>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: data.description
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    )
}