import './xemanh.css'
import { Image } from 'antd';
function XemAnh({image}){
    console.log(image);
    return (
        <>
            <div className="xemanh">
                <div className="xemanh__container">
                    <div className = "xemanh__images">
                        {image?.length > 0 ? image.map((item,index) => (
                            <Image className = "image" width = {200} height = {200}  src = {item} key = {index}></Image>
                        )) : <></>}
                    </div>
                </div>
            </div>
        </>
    )
}
export default XemAnh;