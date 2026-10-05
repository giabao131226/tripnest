import { useEffect, useState } from "react"
import SwalAlert from "../../../Component/SwalAlert/swal-alert";


export default function VoucherCategory(){
    const [categories,setCategories] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        fetch(`${apiUrl}/categories`)
            .then(async res => {
                const data = await res.json();
                if(!res.ok || !data.success) throw new Error(data.message);
                return data;
            }).then(data => {
                console.log(data);
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
            <h1>Trang danh mục</h1>
        </>
    )
}