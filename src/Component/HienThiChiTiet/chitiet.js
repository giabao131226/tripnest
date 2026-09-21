import { useContext, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom"
import XemAnh from "../XemAnh/xemanh";
import AboutRoom from "../AboutRoom/AboutRoom";
import SwalAlert from "../SwalAlert/swal-alert";

function ChiTiet(){
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const params = useParams()
    const [detail,setDetail] = useState({})
    const [disableButton,setDisable] = useState(false)

    useEffect(() => {
        fetch(`${apiUrl}bds/detail/`+params.id)
            .then(async res => {
                const data = res.json();
                if(!res.ok) throw new Error(data.message);
                return data;
            })
            .then( async (data) => {
                if(data.success) setDetail(data.detail);
            }).catch(ex => {
                SwalAlert({
                    "status": "error",
                    "time": 2000,
                    "message": ex
                })
            })
    },[])
    return (
        <>
            <div className="xemchitiet">
                <div className="xemchitiet__container">
                    <XemAnh image = {detail.images}/>
                    <AboutRoom data = {detail} disableButton = {disableButton} setDisable  = {setDisable} params = {params}/>
                </div>
            </div>
        </>
    )
}
export default ChiTiet;