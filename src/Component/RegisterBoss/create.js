import { Modal, Form, Input, Select, Button, Image } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import "../../assets/css/client/manage-accommodation/create.css"
import { FaInbox } from "react-icons/fa6";
import { data, useAsyncError } from "react-router-dom";
import Swal from 'sweetalert2'

export default function CreateAccommodation() {
    const [content, setContent] = useState("");
    const [imageAccomodation, setImageAccomodation] = useState([]);
    const [imagesUpToSever, setImagesUpToSever] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wards, setWards] = useState([]);
    const [imagePreviewLisence, setImagePreviewLisence] = useState("");
    const [dataUpToSever, setDataUpToSever] = useState({});
    const [amenities, setAmenities] = useState([]);
    const [amenity, setAmenity] = useState([]);
    const [categories, setCategories] = useState([]);
    const [previewRoomImage, setPreviewRoomImage] = useState({});  
    const [roomImages, setRoomImages] = useState([]);
    const [roomImageRoomIds, setRoomImageRoomIds] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    const handlePreviewImage = useCallback((e) => {
        const files = e.target.files;
        const name = e.target.name;

        if (name == "lisence") {
            if (files.length > 0) {
                const urlLinsence = URL.createObjectURL(files[0]);
                setImagePreviewLisence(urlLinsence);
            }
            return;
        }

        if (name == "room-images") {
            const room_id = e.target.getAttribute("room-id");

            if (files.length <= 0) return;

            const newPreviewRoomImage = {
                ...previewRoomImage,
                [room_id]: [...(previewRoomImage[room_id] || [])]
            };

            const newRoomImages = [...roomImages];
            const newRoomImageRoomIds = [...roomImageRoomIds];

            Array.from(files).forEach((file) => {
                const url = URL.createObjectURL(file);

                newPreviewRoomImage[room_id].push(url);
                newRoomImages.push(file);
                newRoomImageRoomIds.push(room_id);
            });

            setPreviewRoomImage(newPreviewRoomImage);
            setRoomImages(newRoomImages);
            setRoomImageRoomIds(newRoomImageRoomIds);

            return;
        }

        const arrayImage = [...imageAccomodation];
        const images = [...imagesUpToSever];

        Array.from(files).forEach((item) => {
            const url = URL.createObjectURL(item);
            arrayImage.push(url);
            images.push(item);
        });

        setImageAccomodation(arrayImage);
        setImagesUpToSever(images);
    }, [
        imageAccomodation,
        imagesUpToSever,
        previewRoomImage,
        roomImages,
        roomImageRoomIds
    ]);

    const handleRemoveImagePreview = useCallback((e) => {
        const indexImage = e.target.getAttribute("image-index");
        const newImageAccomodation = [], newImagesUpToServer = [];
        imageAccomodation.forEach((item, index) => {
            if (index != indexImage) {
                newImageAccomodation.push(item);
                newImagesUpToServer.push(imagesUpToSever[index]);
            }
        })
        setImageAccomodation(newImageAccomodation);
        setImagesUpToSever(newImagesUpToServer);

    }, [imageAccomodation, imagesUpToSever]);

    const handleChangeProvince = useCallback((e) => {
        const provinceId = e.target.value;
        const name = e.target.name;
        if (provinceId == "province-default") {
            setWards([]);
            return;
        }
        const index = provinces.findIndex((item) => item._id == provinceId);
        setDataUpToSever({ ...dataUpToSever, [name]: provinceId });
        setWards(provinces[index].wards);
    }, [provinces, dataUpToSever]);

    const handleChangeAmenity = useCallback((e) => {
        const amenityID = e.target.value;
        if (e.target.checked) {
            setAmenity([...amenity, amenityID]);
        } else {
            const newAmenity = amenity.filter((item) => item != amenityID);
            setAmenity(newAmenity);
        }
    }, [amenity])

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setDataUpToSever({ ...dataUpToSever, [name]: value });
    });

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const imageLisence = document.querySelector("input#lisence");

        const formData = new FormData();

        Object.keys(dataUpToSever).forEach((item) => {
            if (item !== "rooms") {
                formData.append(item, dataUpToSever[item]);
            }
        });

        formData.append("rooms", JSON.stringify(dataUpToSever.rooms || []));
        formData.append("amenity", JSON.stringify(amenity));

        if (imageLisence?.files[0]) {
            formData.append("lisence", imageLisence.files[0]);
        }

        imagesUpToSever.forEach((item) => {
            formData.append("images", item);
        });

        roomImages.forEach((item) => {
            formData.append("roomImages", item);
        });

        roomImageRoomIds.forEach((item) => {
            formData.append("roomImageRoomIds", item);
        });

        fetch(`${apiUrl}bds/save`, {
            method: "POST",
            credentials: "include",
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Đã lưu thành công!",
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

                    e.target.reset();
                    setDataUpToSever({});
                    setImageAccomodation([]);
                    setImagesUpToSever([]);
                    setImagePreviewLisence("");
                    setAmenity([]);
                    setPreviewRoomImage({});                    
                    setRoomImages([]);
                    setRoomImageRoomIds([]);
                }
            });
    }, [dataUpToSever, amenity, imagesUpToSever, roomImages, roomImageRoomIds]);

    const generateCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };
    // Xử lý room
    const handleChangeRoomCount = useCallback((action, id) => {
        if (action == "add") {
            const newRoom = dataUpToSever.rooms != undefined ? dataUpToSever.rooms : [];
            newRoom.push({ "id-tmp": generateCode() });
            setDataUpToSever({ ...dataUpToSever, rooms: newRoom });
        }
        else {
            setDataUpToSever(prev => ({
                ...prev,
                rooms: prev.rooms.filter(
                    item => (item._id || item["id-tmp"]) !== id
                )
            }));
        }
    }, [dataUpToSever])

    const handleChangeDetailRoom = useCallback((e, id) => {
        const { name, value } = e.target;
        const rooms = dataUpToSever.rooms;

        const index = rooms.findIndex(
            item => (item._id || item["id-tmp"]) === id
        );
        if (index < 0) return;
        rooms[index][name] = value;
        setDataUpToSever({ ...dataUpToSever, "rooms": rooms });
    }, [dataUpToSever])

    useEffect(() => {
        fetch(`${apiUrl}province`)
            .then(res => res.json())
            .then(data => {
                if (data.success) setProvinces(data.data);
            })
        fetch(`${apiUrl}amenity`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAmenities(data.amenities);
                }
            })
        fetch(`${apiUrl}categories`)
            .then(async res => {
                const data = res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            }).then(data => {
                if (data.success) setCategories(data.categories);
            }).catch(ex => {
                console.log(ex);
            })
    }, [])
    return (
        <>
            <div className="py-3"></div>
            <div className="accommodation-page">
                <form className="accommodation-form" onSubmit={handleSubmit}>
                    <div className="accommodation-content">
                        <div className="accommodation-left">
                            <div className="form-section">
                                <h3>Thông Tin Cơ Bản</h3>
                                <div className="form-group">
                                    <label>Tên Cơ Sở Lưu Trú</label>
                                    <input type="text" name="name" onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <div className="address-row">
                                        <div className="form-group">
                                            <label>Thành phố</label>
                                            <select name="province_id" onChange={handleChangeProvince}>
                                                <option value="province-default">--Chọn thành phố--</option>
                                                {provinces.map((item, index) => <option value={item._id} key={index}>{item.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Xã / Phường</label>
                                            <select name="ward_id" onChange={handleChange}>
                                                <option>--Chọn xã/phường--</option>
                                                {wards.map((item, index) => <option value={item._id} key={index}>{item.name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group address-detail">
                                        <label>Địa chỉ cụ thể</label>
                                        <input onChange={handleChange} name="address" type="text" placeholder="Ví dụ: 123 Trần Duy Hưng, Cầu Giấy" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Loại Cơ Sở Lưu Trú</label>
                                    <select name="category_id" onChange={handleChange}>
                                        <option>--Lựa chọn loại cơ sở lưu trú--</option>
                                        {categories.length > 0 ? categories.map((item) => <option key={item._id} value={item._id}>{item.title}</option>) : <></>}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Tiện Ích</label>
                                    <div className="amenity-grid">
                                        {amenities.length > 0 ? (
                                            <>
                                                {amenities.map((item, index) =>
                                                    <label key={index} className="amenity-item">
                                                        <input type="checkbox" name="amenity" value={item._id} onChange={handleChangeAmenity} />
                                                        <div className="amenity-content">
                                                            <div className="amenity-icon">
                                                                <i className={item.icon}></i>
                                                            </div>
                                                            <span>{item.name}</span>
                                                        </div>
                                                    </label>
                                                )}
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
                                    <Editor apiKey="1a2hzecrr53ypadb7v095uo5i8u7xzhzy2a0al9uyn03q53h" value={dataUpToSever.description} onEditorChange={(newValue) => setDataUpToSever({ ...dataUpToSever, "description": newValue })} />
                                </div>
                            </div>
                            <div className="form-section">
                                <div className="section-header">
                                    <div>
                                        <h3>Danh Sách Phòng</h3>
                                        <span>Thêm các loại phòng của cơ sở lưu trú</span>
                                    </div>
                                    <button type="button" className="btn-add-room" onClick={() => { handleChangeRoomCount("add") }}>+ Thêm phòng</button>
                                </div>
                                <div className="room-list">
                                    {dataUpToSever.rooms?.map((room, index) =>
                                        <div className="room-card" key={room._id || room["id-tmp"]}>
                                            <div className="room-header">
                                                <div>
                                                    <h4>Phòng {room["id-tmp"]}</h4>
                                                    <span>Thông tin loại phòng</span>
                                                </div>
                                                <button type="button" className="btn-remove-room" onClick={() => { handleChangeRoomCount("delete", room._id || room["id-tmp"]) }}>× Xóa</button>
                                            </div>
                                            <div className="room-grid">
                                                <div className="form-group">
                                                    <label>Tên phòng</label>
                                                    <input type="text" name="title" placeholder="Ví dụ: Phòng Deluxe" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Diện tích (m²)</label>
                                                    <input type="number" name="room_size" placeholder="Ví dụ: 35" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Giá mỗi đêm (VNĐ)</label>
                                                    <input type="number" name="price_per_night" placeholder="Ví dụ: 500000" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Số khách tối đa</label>
                                                    <input type="number" name="max_guests" placeholder="Ví dụ: 4" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phí vệ sinh (VNĐ)</label>
                                                    <input type="number" name="clean_fee" placeholder="Ví dụ: 50000" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Phí dịch vụ (%)</label>
                                                    <input type="number" name="service_fee_percent" placeholder="Ví dụ: 10" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Số phòng ngủ</label>
                                                    <input type="number" name="beds_count" placeholder="Ví dụ: 2" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Số giường</label>
                                                    <input type="number" name="bedrooms_count" placeholder="Ví dụ: 2" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Số phòng tắm</label>
                                                    <input type="number" placeholder="Ví dụ: 1" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Tổng số phòng</label>
                                                    <input type="number" placeholder="Ví dụ: 5" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Tổng số lượng phòng</label>
                                                    <input type="number" placeholder="Ví dụ: 5" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }} />
                                                </div>
                                                <div className="form-group">
                                                    <label>Trạng thái</label>
                                                    <select name="status" onChange={(e) => {
                                                        handleChangeDetailRoom(e, (room._id ? room._id : room["id-tmp"]))
                                                    }}>
                                                        <option value="active">Đang hoạt động</option>
                                                        <option value="inactive">Ngừng hoạt động</option>
                                                    </select>
                                                </div>
                                                <div className="form-group room-description">
                                                    <label>Mô tả phòng</label>
                                                    <Editor
                                                        apiKey="1a2hzecrr53ypadb7v095uo5i8u7xzhzy2a0al9uyn03q53h"
                                                        value={room.description}
                                                        onEditorChange={(newValue) => {
                                                            const id = room._id ? room._id : room["id-tmp"];
                                                            const index = dataUpToSever.rooms.findIndex((item) => item[room._id ? "_id" : "id-tmp"] == id);
                                                            if (index < 0) return;
                                                            const newRoom = dataUpToSever.rooms;
                                                            newRoom[index].description = newValue;
                                                            setDataUpToSever({ ...dataUpToSever, "rooms": newRoom });
                                                        }} />
                                                </div>

                                                <div className="form-group room-images">
                                                    <label
                                                        className="btn-upload-images"
                                                        htmlFor={`room-images-${room["id-tmp"]}`}
                                                    >
                                                        + Thêm ảnh
                                                    </label>

                                                    <input
                                                        id={`room-images-${room["id-tmp"]}`}
                                                        type="file"
                                                        name="room-images"
                                                        room-id={room["id-tmp"]}
                                                        accept="image/*"
                                                        multiple
                                                        hidden
                                                        onChange={handlePreviewImage}
                                                    />

                                                    <div className="room-image-preview">
                                                        {previewRoomImage[room["id-tmp"]]?.map((item, index) => (
                                                            <Image
                                                                src={item}
                                                                key={index}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                        <div className="accommodation-right">
                            <div className="form-section">
                                <div className="upload-section">
                                    <div className="upload-header">
                                        <label>Ảnh Về Cơ Sở Lưu Trú</label>
                                        <label htmlFor="imageAccomodation" className="add-image-label">Thêm ảnh</label>
                                    </div>
                                    <input onChange={handlePreviewImage} id="imageAccomodation" type="file" name="image" accept="image/*" multiple className="hidden-input" />
                                    <div className="image-preview-container">
                                        {imageAccomodation.length > 0 ? (
                                            <>
                                                {imageAccomodation.map((item, index) =>
                                                    <div className="image-item" key={index}>
                                                        <Image src={item} className="image" />
                                                        <button type="button" onClick={handleRemoveImagePreview} input-name="images" image-index={index}>×</button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="empty">
                                                <FaInbox className="font-30" />
                                            </div>
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
                        <button className="btn-save" type="submit">Lưu</button>
                        <button className="btn-request" type="button">Yêu Cầu Xác Minh</button>
                    </div>
                </form>
            </div>
        </>
    )
}