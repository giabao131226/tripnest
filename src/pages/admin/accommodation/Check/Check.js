import { Button, message, Tag, Rate, Image, Badge } from "antd";
import "./Check.css"
import { useCallback, useEffect, useState } from "react";
import { FaHotel } from "react-icons/fa6";
import { FaLocationDot } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";


export default function Check() {
    const acc = useSelector(state => state.auth).payload;
    const navigate = useNavigate();
    const [idPhong, setIDPhong] = useState()
    const [accommodation, setAccommodation] = useState([])

    //Khi xoá thì set lại reload
    const [reload, setReload] = useState(false)
    //Data change
    const [dataChange, setDataC] = useState({})
    const [loaiPhong, setLoaiP] = useState([])
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        fetch("http://localhost:5000/admin/accommodation", {
            "credentials": "include"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setAccommodation(data.bds);
            })
            .catch(ex => {
                Swal.fire({
                    icon: "error",
                    title: "Oops!!",
                    text: "Có lỗi xảy ra, Vui lòng thử lại",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    background: "#ffffff",
                    color: "#333",
                    iconColor: "#22c55e"
                });
            })
    }, [reload])

    const handleCheck = useCallback((e) => {
        const id = e.target.getAttribute("id-element");
        const status = e.target.getAttribute("status");
        fetch(`http://localhost:5000/admin/accommodation/check/${id}/${status}`, {
            "credentials": "include",
            "method": "PATCH"
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: "Cập nhật trạng thái thành công",
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 2500,
                        timerProgressBar: true,
                        background: "#ffffff",
                        color: "#333",
                        iconColor: "#22c55e"
                    });
                    setReload(!reload);
                }
            })
            .catch(ex => {
                Swal.fire({
                    icon: "error",
                    title: "Oops!!",
                    text: "Có lỗi xảy ra, Vui lòng thử lại",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 2500,
                    timerProgressBar: true,
                    background: "#ffffff",
                    color: "#333",
                    iconColor: "#22c55e"
                });
            })
    }, [accommodation])


    return (
        <>
            {contextHolder}
            <div className="dsbds">
                <div className="dsbds__container">
                    <div className="dsbds__title">
                        <h2 className="m-0">Kiểm duyệt bất động sản</h2>
                    </div>
                    <hr></hr>
                    <div className="dsbds__main">
                        {accommodation.length != 0 ? <div className="dsbdsList__main">
                            {accommodation.map((item, index) => (
                                <Badge.Ribbon text={item.duyet == "true" ? "Đã được kiểm duyệt" : (item.duyet == "false" ? "Bị từ chối" : "Đang chờ kiểm duyệt")} color={item.duyet == "true" ? "green" : (item.duyet == "false" ? "red" : "blue")}>
                                    <div className="dsbds__box" key={index}>
                                        <div className="dsbdsbox__container">
                                            <div className="dsbdsbox__title">
                                                <div className="dsbdsbox__tit1">
                                                    <div className="dsbds__nameAndRate">
                                                        <h2>{item.name}</h2>
                                                        <Rate allowHalf defaultValue={item.rate}></Rate>
                                                    </div>
                                                    <div className="dsbds__locationAndtype">
                                                        <div className="dsbds__location">
                                                            <FaLocationDot /> {item.address}
                                                        </div>
                                                        <Tag color={"blue"} icon={<FaHotel />}>  {item.loaiPhong}</Tag>
                                                    </div>
                                                </div>
                                                <div className="dsbds__priceAndcheck">
                                                    <p>{item.price}VND</p>
                                                    <button className="btnXemChiTiet">Xem chi tiết</button>
                                                    <button style={{ "fontWeight": "600" }} onClick={handleCheck} id-element={item._id} status="active" className="buttonChinhSua">
                                                        <FaCheck /> Duyệt
                                                    </button>
                                                    <button onClick={handleCheck} id-element={item._id} status="denided" className="buttonXoa">
                                                        <IoClose /> Từ Chối
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="dsbds__image">
                                                {item.images?.map((item, index) => (
                                                    <div className="image" key={index}>
                                                        <Image src={item} width={200}></Image>
                                                    </div>

                                                ))}
                                                <button className="dsbds__themAnh" id={accommodation[index].id}>
                                                    Thêm Cơ Sở Lưu Trú
                                                </button>
                                            </div>
                                            <hr></hr>
                                            <div className="dsbds__about">
                                                <div className="dsbds__des dsbox">
                                                    <h3>Mô Tả</h3>
                                                    <div className="mota">{item.description}</div>
                                                </div>
                                                <div className="dsbds__map dsbox">
                                                    <h3>Vị trí</h3>
                                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29818.11356688405!2d105.78095874033141!3d20.901687857716034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135b2be9c0f60cf%3A0xabb8282347787454!2zTeG7uSBIxrBuZywgVGhhbmggT2FpLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1765525448653!5m2!1svi!2s" width="400" height="450" style={{ "border": 0 }} loading="lazy" allowFullScreen={true} referrerPolicy="no-referrer-when-downgrade"></iframe>
                                                </div>
                                                <div className="dsbds__tienich dsbox">
                                                    <h3>Tiện ích</h3>
                                                    <ul>
                                                        {item.amenity?.map((amenity, index) => (
                                                            <li key={index} id={amenity._id} className="dsbds__ti">

                                                                <div className="d-flex items-center gap-x-3">
                                                                    <i className={amenity.icon}></i>
                                                                    <span>{amenity.name}</span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Badge.Ribbon>
                            ))}
                        </div> : <div className="bdsList__main">
                            <p className="text__empty">
                                Hiện tại bạn chưa có cơ sở lưu trú nào ...
                            </p>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    )
}