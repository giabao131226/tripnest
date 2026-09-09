import { useEffect, useState,useCallback } from "react";
import { Carousel, Tag, Rate } from 'antd';
import { FaHotel } from "react-icons/fa6";
import { Link } from 'react-router-dom'
import { useOutletContext } from "react-router-dom";
import "./queryroom.css"
import { TbMoodEmptyFilled } from "react-icons/tb";
import Swal from 'sweetalert2';
import Pagination from "../Pagination/pagination";

function QueryRoom() {
    const {accommodations,currentPage,totalPage,onPageChange} = useOutletContext(); 
    
    return (
        <>
            <div className="bdsList">
                <div className="bdsList__container">
                    <div className="quangcao">
                        <img src="https://stc.shopiness.vn/deal/2018/10/16/d/f/3/c/1539673384912_540.png" loading="lazy"></img>
                        <img src="https://img.pikbest.com/01/59/62/86jpIkbEsT2gA.jpg!f305cw" loading="lazy"></img>
                    </div>
                    {accommodations.length > 0 ? <div className="bdsList__main">
                        {accommodations.map((item, index) => (
                            <div className="bdsbox" key={item._id}>
                                <div className="bdsbox__container">
                                    <Carousel style={{ width: 200 }} autoplay arrows>
                                        {item.images.map((image, index) => (
                                            <div className="bds__image" key={index}>
                                                <img src={image} loading = "lazy"></img>
                                            </div>
                                        ))}
                                    </Carousel>
                                    <Link to={item.id}>
                                        <div className="bds__about">
                                            <div className="bds__nameAndRate">
                                                <span>{item.name}</span>
                                                <span>{item.rate}/10</span>
                                            </div>
                                            <div className="bds__typeAndRate">
                                                <Tag icon={<FaHotel />} color="#55acee">
                                                    {item.category_id}
                                                </Tag>
                                                <Rate defaultValue={item.rate} allowHalf />
                                            </div>
                                            <div className="bds__tienIch">
                                                {item.amenityIds.map((dv) => (
                                                    <Tag color="cyan" key={dv._id}>{dv.tienich}</Tag>
                                                ))}
                                            </div>
                                            <div className="bds__danhGia">
                                                <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="bds__right">
                                        <p>{item.price}VND</p>
                                        <Link to={`/list-bds/detail/${item._id}`}><button>Xem Phòng</button></Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Pagination currentPage={currentPage} totalPage={totalPage} onPageChange={onPageChange} />
                    </div> : <div className="bdsList__main">
                        <div className="icon__empty"><TbMoodEmptyFilled /></div>
                        <p className="text__empty">Dữ liệu sẽ được cập nhật sau....</p>
                    </div>}
                    
                </div>
            </div>
        </>
    )
}
export default QueryRoom;