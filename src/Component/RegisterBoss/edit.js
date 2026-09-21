import { Modal, Form, Input, Select, Button, Image } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useCallback, useEffect, useState } from "react";
import "../../assets/css/client/manage-accommodation/create.css";
import "../../assets/css/client/manage-accommodation/wizard-create.css";
import { FaInbox } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2';

export default function EditProperty() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [imageAccomodation, setImageAccomodation] = useState([]);
    const [imagesUpToSever, setImagesUpToSever] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [imagePreviewLisence, setImagePreviewLisence] = useState("");
    const [dataUpToSever, setDataUpToSever] = useState({});
    const [amenities, setAmenities] = useState([]);
    const [amenity, setAmenity] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reload, setReload] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const params = useParams();

    const handlePreviewImage = useCallback((e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        
        const name = e.target.name;
        if (name === "lisence") {
            const urlLinsence = URL.createObjectURL(files[0]);
            setImagePreviewLisence(urlLinsence);
            return;
        }

        const arrayImage = [...imageAccomodation];
        const images = [...imagesUpToSever];
        Array.from(files).forEach((item) => {
            const url = URL.createObjectURL(item);
            arrayImage.push({
                "url": url,
                "type": "new"
            });
            images.push(item);
        });
        setImageAccomodation(arrayImage);
        setImagesUpToSever(images);
    }, [imageAccomodation, imagesUpToSever]);

    const handleRemoveImagePreview = useCallback((e) => {
        const indexImage = parseInt(e.currentTarget.getAttribute("image-index"), 10);
        const newImageAccomodation = [];
        const newImagesUpToServer = [];
        let oldImage = dataUpToSever.images ? [...dataUpToSever.images] : [];
        let indexOld = -1;
        let indexNew = -1;

        imageAccomodation.forEach((item, index) => {
            if (item.type === "old") indexOld++;
            else indexNew++;

            if (index !== indexImage) {
                newImageAccomodation.push(item);
                if (item.type === "new") newImagesUpToServer.push(imagesUpToSever[indexNew]);
            } else {
                if (item.type === "old") {
                    oldImage = oldImage.filter((_, i) => i !== indexOld);
                }
            }
        });

        setImageAccomodation(newImageAccomodation);
        setImagesUpToSever(newImagesUpToServer);
        setDataUpToSever((prev) => ({ ...prev, images: oldImage }));
    }, [imageAccomodation, imagesUpToSever, dataUpToSever.images]);

    const handleChangeProvince = useCallback((e) => {
        const provinceId = e.target.value;
        const name = e.target.name || "province_id";
        if (provinceId === "province-default") {
            setWards([]);
            setDataUpToSever(prev => ({ ...prev, [name]: "" }));
            return;
        }
        const found = provinces.find((item) => item._id.toString() === provinceId.toString());
        setDataUpToSever(prev => ({ ...prev, [name]: provinceId }));
        setWards(found ? found.wards || [] : []);
    }, [provinces]);

    const handleChangeAmenity = useCallback((e) => {
        const amenityID = e.target.value;
        if (e.target.checked) {
            setAmenity(prev => [...prev, amenityID]);
        } else {
            setAmenity(prev => prev.filter((item) => item.toString() !== amenityID.toString()));
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataUpToSever(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (currentStep !== 3) return;

        const imageLisence = document.querySelector("input#lisence");
        const formData = new FormData();

        Object.keys(dataUpToSever).forEach((item) => {
            if (item === "images") {
                if (dataUpToSever[item] && dataUpToSever[item].length > 0) {
                    formData.append("oldImages", JSON.stringify(dataUpToSever[item]));
                }
            } else if (item === "rooms") {
                formData.append("rooms", JSON.stringify(dataUpToSever[item]));
            } else if (item !== "amenityIds" && item !== "amenity") {
                formData.append(item, dataUpToSever[item] ?? "");
            }
        });

        formData.append("amenity", JSON.stringify(amenity));

        if (imageLisence && imageLisence.files[0]) {
            formData.append("lisence", imageLisence.files[0]);
        }

        if (imagesUpToSever.length > 0) {
            imagesUpToSever.forEach((item) => {
                formData.append("images", item);
            });
        }

        console.log("Cập nhật");

        fetch(`${apiUrl}bds/update/${params.id}`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(async res => {
                const resData = await res.json();
                if (!res.ok) throw new Error(resData.message || "Update failed");
                return resData;
            })
            .then(resData => {
                if (resData.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Cập Nhật thành công!",
                        text: "Thông tin cơ sở lưu trú đã được cập nhật.",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2500,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#22c55e"
                    });
                    setReload(prev => !prev);
                }
            })
            .catch(ex => {
                console.error(ex);
                Swal.fire({
                    icon: "error",
                    title: "Có lỗi xảy ra",
                    text: ex.message || "Không thể cập nhật thông tin."
                });
            });
    }, [dataUpToSever, amenity, imagesUpToSever, apiUrl, params.id, currentStep]);

    useEffect(() => {
        fetch(`${apiUrl}bds/edit/${params.id}`)
            .then(res => res.json())
            .then(resData => {
                const accommodation = resData.accommodationDetail || {};
                setDataUpToSever(accommodation);
                setImagePreviewLisence(accommodation.lisence || "");
                
                if (accommodation.images && accommodation.images.length > 0) {
                    const oldImage = accommodation.images.map((item) => ({ "url": item, "type": "old" }));
                    setImageAccomodation(oldImage);
                } else {
                    setImageAccomodation([]);
                }

                if (accommodation.amenityIds) {
                    setAmenity(accommodation.amenityIds.map(id => id.toString()));
                }
            })
            .catch(err => console.error(err));
    }, [apiUrl, params.id, reload]);

    useEffect(() => {
        fetch(`${apiUrl}province`)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) setProvinces(resData.data);
            })
            .catch(err => console.error(err));

        fetch(`${apiUrl}amenity`)
            .then(res => res.json())
            .then(resData => {
                if (resData.success) setAmenities(resData.amenities);
            })
            .catch(err => console.error(err));

        fetch(`${apiUrl}categories`)
            .then(async res => {
                const resData = await res.json();
                if (!res.ok) throw new Error(resData.message);
                return resData;
            })
            .then(resData => {
                if (resData.success) setCategories(resData.categories);
            })
            .catch(ex => console.error(ex));
    }, [apiUrl]);

    useEffect(() => {
        if (dataUpToSever.province_id && provinces.length > 0) {
            const found = provinces.find((item) => item._id.toString() === dataUpToSever.province_id.toString());
            setWards(found ? found.wards || [] : []);
        }
    }, [provinces, dataUpToSever.province_id]);

    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    const handleChangeRoomCount = useCallback((action, id) => {
        if (action === "add") {
            setDataUpToSever(prev => {
                const currentRooms = prev.rooms ? [...prev.rooms] : [];
                return {
                    ...prev,
                    rooms: [...currentRooms, { "id-tmp": generateCode(), status: "active" }]
                };
            });
        } else {
            setDataUpToSever(prev => ({
                ...prev,
                rooms: (prev.rooms || []).filter(
                    item => (item._id || item["id-tmp"]) !== id
                )
            }));
        }
    }, []);

    const handleChangeDetailRoom = useCallback((e, id) => {
        const { name, value } = e.target;
        setDataUpToSever(prev => {
            const rooms = prev.rooms ? [...prev.rooms] : [];
            const index = rooms.findIndex(
                item => (item._id || item["id-tmp"]) === id
            );
            if (index < 0) return prev;
            rooms[index] = { ...rooms[index], [name]: value };
            return { ...prev, rooms };
        });
    }, []);

    const handleNextStep = () => {
        if (currentStep === 1) {
            if (!dataUpToSever.name || !dataUpToSever.address) {
                Swal.fire({
                    icon: "error",
                    title: "Thiếu thông tin",
                    text: "Vui lòng nhập tên và địa chỉ cơ sở lưu trú.",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2000
                });
                return;
            }
        }
        setCurrentStep((step) => Math.min(3, step + 1));
    };

    const handlePrevStep = () => {
        setCurrentStep((step) => Math.max(1, step - 1));
    };

    const handleGoToStep = (stepNumber) => {
        if (stepNumber === currentStep) return;
        setCurrentStep(stepNumber);
    };

    const steps = [
        { number: 1, title: "Thông tin cơ bản", desc: "Tên, địa chỉ, tiện ích" },
        { number: 2, title: "Thông tin phòng", desc: "Loại phòng của cơ sở lưu trú" },
        { number: 3, title: "Hình ảnh", desc: "Ảnh cơ sở và giấy tờ xác minh" }
    ];

    return (
        <>
            <div className="py-3"></div>
            <div className="accommodation-page wizard-page">
                <form className="accommodation-form wizard-form" onSubmit={handleSubmit}>
                    <div className="wizard-header">
                        <h2>Chỉnh sửa cơ sở lưu trú</h2>
                        <p>Cập nhật thông tin theo 3 bước, giống trang tạo mới</p>
                    </div>
                    <div className="wizard-steps">
                        {steps.map((item) => (
                            <div
                                className={`wizard-step ${currentStep === item.number ? "active" : ""} ${currentStep > item.number ? "done" : ""}`}
                                key={item.number}
                                onClick={() => handleGoToStep(item.number)}
                            >
                                <button
                                    type="button"
                                    className="wizard-step-index"
                                    onClick={() => handleGoToStep(item.number)}
                                >
                                    {item.number}
                                </button>
                                <div className="wizard-step-text">
                                    <strong>{item.title}</strong>
                                    <span>{item.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="accommodation-content wizard-content">
                        <div className={`wizard-panel ${currentStep === 1 ? "is-open" : ""}`}>
                            <div className="form-section">
                                <h3>Thông Tin Cơ Bản</h3>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tên Cơ Sở Lưu Trú</label>
                                        <input type="text" name="name" onChange={handleChange} value={dataUpToSever.name || ""} />
                                    </div>
                                    <div className="form-group">
                                        <label>Loại Cơ Sở Lưu Trú</label>
                                        <select name="category_id" onChange={handleChange} value={dataUpToSever.category_id || ""}>
                                            <option value="">--Lựa chọn loại cơ sở lưu trú--</option>
                                            {categories.length > 0 && categories.map((item) => (
                                                <option key={item._id} value={item._id}>{item.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <div className="address-row">
                                        <div className="form-group">
                                            <label>Thành phố</label>
                                            <select name="province_id" onChange={handleChangeProvince} value={dataUpToSever.province_id || "province-default"}>
                                                <option value="province-default">--Chọn thành phố--</option>
                                                {provinces.map((item) => (
                                                    <option key={item._id} value={item._id.toString()}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Xã / Phường</label>
                                            <select name="ward_id" onChange={handleChange} value={dataUpToSever.ward_id || ""}>
                                                <option value="">--Chọn xã/phường--</option>
                                                {wards.map((item, index) => (
                                                    <option value={item._id} key={item._id || index}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group address-detail">
                                        <label>Địa chỉ cụ thể</label>
                                        <input onChange={handleChange} name="address" type="text"
                                            placeholder="Ví dụ: 123 Trần Duy Hưng, Cầu Giấy"
                                            value={dataUpToSever.address || ""} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Tiện Ích</label>
                                    <div className="amenity-grid">
                                        {amenities.length > 0 ? (
                                            <>
                                                {amenities.map((item, index) => (
                                                    <label key={item._id || index} className="amenity-item">
                                                        <input
                                                            type="checkbox"
                                                            name="amenity"
                                                            value={item._id}
                                                            checked={amenity.some(aId => aId.toString() === item._id.toString())}
                                                            onChange={handleChangeAmenity}
                                                        />
                                                        <div className="amenity-content">
                                                            <div className="amenity-icon">
                                                                <i className={item.icon}></i>
                                                            </div>
                                                            <span>{item.name}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="empty">
                                                <FaInbox className="font-30" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Mô Tả</label>
                                    <Editor apiKey="1a2hzecrr53ypadb7v095uo5i8u7xzhzy2a0al9uyn03q53h" value={dataUpToSever.description || ""}
                                        onEditorChange={(newValue) => setDataUpToSever(prev => ({ ...prev, description: newValue }))}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`wizard-panel ${currentStep === 2 ? "is-open" : ""}`}>
                            <div className="form-section">
                                <div className="section-header">
                                    <div>
                                        <h3>Danh Sách Phòng</h3>
                                        <span>Thêm các loại phòng của cơ sở lưu trú</span>
                                    </div>
                                    <button type="button" className="btn-add-room" onClick={() => { handleChangeRoomCount("add") }}>+ Thêm phòng</button>
                                </div>
                                <div className="room-list">
                                    {(!dataUpToSever.rooms || dataUpToSever.rooms.length === 0) ? (
                                        <div className="room-empty">Chưa có phòng nào. Bấm “+ Thêm phòng” để bắt đầu.</div>
                                    ) : null}
                                    {dataUpToSever.rooms?.map((room, index) => {
                                        const roomId = room._id || room["id-tmp"];
                                        return (
                                            <div className="room-card" key={roomId}>
                                                <div className="room-header">
                                                    <div>
                                                        <h4>Loại phòng {index + 1}</h4>
                                                        <span>Thông tin loại phòng</span>
                                                    </div>
                                                    <button type="button" className="btn-remove-room" onClick={() => { handleChangeRoomCount("delete", roomId) }}>× Xóa</button>
                                                </div>
                                                <div className="room-grid">
                                                    <div className="form-group">
                                                        <label>Tên phòng</label>
                                                        <input type="text" name="title" placeholder="Ví dụ: Phòng Deluxe" value={room.title || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Diện tích (m²)</label>
                                                        <input type="number" name="room_size" placeholder="Ví dụ: 35" value={room.room_size || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Giá mỗi đêm (VNĐ)</label>
                                                        <input type="number" name="price_per_night" placeholder="Ví dụ: 500000" value={room.price_per_night || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Số khách tối đa</label>
                                                        <input type="number" name="max_guests" placeholder="Ví dụ: 4" value={room.max_guests || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Phí vệ sinh (VNĐ)</label>
                                                        <input type="number" name="clean_fee" placeholder="Ví dụ: 50000" value={room.clean_fee || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Phí dịch vụ (%)</label>
                                                        <input type="number" name="service_fee_percent" placeholder="Ví dụ: 10" value={room.service_fee_percent || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Số phòng ngủ</label>
                                                        <input type="number" name="bedrooms_count" placeholder="Ví dụ: 2" value={room.bedrooms_count || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Số giường</label>
                                                        <input type="number" name="beds_count" placeholder="Ví dụ: 2" value={room.beds_count || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Số phòng tắm</label>
                                                        <input type="number" name="bathrooms_count" placeholder="Ví dụ: 1" value={room.bathrooms_count || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Tổng số lượng phòng</label>
                                                        <input type="number" name="total_rooms" placeholder="Ví dụ: 5" value={room.total_rooms || ""} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }} />
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Trạng thái</label>
                                                        <select name="status" value={room.status || "active"} onChange={(e) => {
                                                            handleChangeDetailRoom(e, roomId);
                                                        }}>
                                                            <option value="active">Đang hoạt động</option>
                                                            <option value="inactive">Ngừng hoạt động</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group room-description">
                                                        <label>Mô tả phòng</label>
                                                        <Editor
                                                            apiKey="1a2hzecrr53ypadb7v095uo5i8u7xzhzy2a0al9uyn03q53h"
                                                            value={room.description || ""}
                                                            onEditorChange={(newValue) => {
                                                                setDataUpToSever(prev => {
                                                                    const rooms = [...prev.rooms];
                                                                    const index = rooms.findIndex((item) => (item._id || item["id-tmp"]) === roomId);
                                                                    if (index < 0) return prev;
                                                                    rooms[index] = { ...rooms[index], description: newValue };
                                                                    return { ...prev, rooms };
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className={`wizard-panel wizard-panel-media ${currentStep === 3 ? "is-open" : ""}`}>
                            <div className="form-section acc-photos">
                                <div className="upload-section">
                                    <div className="upload-header">
                                        <div className="upload-title">
                                            <label>Ảnh về cơ sở lưu trú</label>
                                            <span className="upload-hint">
                                                {imageAccomodation.length > 0
                                                    ? `${imageAccomodation.length} ảnh đã chọn`
                                                    : "Thêm nhiều ảnh để khách dễ hình dung hơn"}
                                            </span>
                                        </div>
                                        <label htmlFor="imageAccomodation" className="add-image-label">Thêm ảnh</label>
                                    </div>
                                    <input onChange={handlePreviewImage} id="imageAccomodation" type="file" name="image" accept="image/*" multiple className="hidden-input" />
                                    <div className={`image-preview-container ${imageAccomodation.length > 0 ? "has-images" : "is-empty"}`}>
                                        {imageAccomodation.length > 0 ? (
                                            <>
                                                {imageAccomodation.map((item, index) => (
                                                    <div className={`image-item ${index === 0 ? "is-cover" : ""}`} key={index}>
                                                        <Image src={item.url} className="image" />
                                                        {index === 0 ? <span className="cover-badge">Ảnh bìa</span> : null}
                                                        <button type="button" onClick={handleRemoveImagePreview} image-index={index}>×</button>
                                                    </div>
                                                ))}
                                                <label htmlFor="imageAccomodation" className="gallery-add-tile">
                                                    + Thêm ảnh
                                                </label>
                                            </>
                                        ) : (
                                            <label htmlFor="imageAccomodation" className="gallery-empty">
                                                <FaInbox className="font-30" />
                                                <strong>Bấm để tải ảnh lên</strong>
                                                <span>JPG, PNG. Có thể chọn nhiều ảnh cùng lúc.</span>
                                            </label>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-section">
                                <h3>Thông Tin Xác Minh</h3>
                                <div className="verification-group">
                                    <div className="upload-header">
                                        <label>Số đỏ / sổ hồng / Hợp đồng thuê / Hợp đồng uỷ quyền</label>
                                        <label htmlFor="lisence" className="add-image-label">Thêm ảnh</label>
                                    </div>
                                    <input id="lisence" onChange={handlePreviewImage} type="file" name="lisence" accept="image/*" className="hidden-input" />
                                    {imagePreviewLisence ? (
                                        <div className="license-preview">
                                            <Image src={imagePreviewLisence} />
                                        </div>
                                    ) : (
                                        <div className="empty verification-empty">
                                            <FaInbox className="font-30" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="verification-note">
                                <strong>Lưu ý</strong>
                                <p>Vui lòng cung cấp hình ảnh giấy tờ rõ nét, đầy đủ thông tin để quá trình xác minh được thực hiện nhanh chóng.</p>
                            </div>
                        </div>
                    </div>
                    <div className="form-buttons">
                        {currentStep > 1 ? (
                            <button className="btn-request" type="button" onClick={handlePrevStep}>Quay lại</button>
                        ) : null}
                        {currentStep < 3 ? (
                            <button className="btn-save" type="button" onClick={handleNextStep}>Tiếp tục</button>
                        ) : (
                            <button className="btn-save" type="submit">Cập Nhật</button>
                        )}
                    </div>
                </form>
            </div>
        </>
    );
}