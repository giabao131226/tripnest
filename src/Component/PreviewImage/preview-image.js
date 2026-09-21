import { useState } from "react";
import "./preview-image.css";
import { Carousel } from "antd";
export default function PreviewImage({ images }) {
    const [imageActive,setImageActive] = useState(1);
    return (
        <>
            <div className="preview-image">
                <Carousel 
                    autoplay 
                    autoplaySpeed={4000} 
                    arrows
                    initialSlide={imageActive-1}
                    afterChange={(currentSlide) => {
                        setImageActive(currentSlide+1);
                    }}  
                >
                    {images.length > 0 ? images.map((item, index) => 
                    <div key={index} className="preview-image__item">
                        <img src={item}></img>
                    </div>)
                        : <img src="" alt="Hiện tại chưa có ảnh"></img>}
                </Carousel>
                <div className="preview-image__footer">
                {images.length > 0 && 
                images.map((item, index) => <div key={index} className= {`preview-image__item ${index+1 == imageActive && "active"}`}>
                        <img src={item} className="cursor-pointer" onClick={() => {
                            setImageActive(index+1);
                        }}></img>
                </div>)}
                </div>
            </div>
        </>
    )
}