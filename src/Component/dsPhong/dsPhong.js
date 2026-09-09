import { useCallback, useEffect, useState } from "react"
import { DatePicker, Select } from 'antd';
import { IoLocation } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { MdDateRange } from "react-icons/md";
import "./dsPhong.css"
import SlideUuDai from "../slideUuDai/SlideUuDai";
import { Outlet, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';
import Pagination from "../Pagination/pagination";
const { RangePicker } = DatePicker;

function BDSList() {
    const [accommodations, setAccommodations] = useState([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [provinceFilter, setProvinceFilter] = useState([])


    const onPageChange = useCallback((page) => {
        setCurrentPage(page);
    }, [currentPage])

    const [loaiPhong, setLoaiP] = useState([])
    const [queryDiaDiem, setQDD] = useState("HaNoi")
    const [queryTypeRoom, setTR] = useState("Villa")
    const [querryTime, setTime] = useState(-1)
    const navigate = useNavigate();
    const getSoNgay = useCallback((start, end) => {
        let ans = 0;
        const day = [
            0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31
        ];
        if ((start[0] % 400 == 0) || (start[0] % 4 == 0 && start[0] % 100 != 0)) {
            day[2] = 29;
        }
        while (start[1] != end[1]) {
            ans += day[start[1]] + 1 - start[1];
            start[1] += 1
            if (start[1] > 12) {
                start[1] = 1;
                start[0] += 1;
                if ((start[0] % 400 == 0) || (start[0] % 4 == 0 && start[0] % 100 != 0)) day[2] = 29;
                else day[2] = 28;
            }
        }
        if (start[2] < end[2]) ans += end[2] - start[2]
        else if (start[2] > end[2]) ans -= start[2] - end[2]
        return ans
    }, [])
    const handleChange = useCallback((value) => {
        setQDD(value)
    }, [])
    const TDLoaiPhong = useCallback((value) => {
        setTR(value)
    }, [])
    const TDTime = useCallback((value) => {
        const startDate = value[0].format("YYYY-MM-DD").split("-").map((item) => {
            return parseInt(item)
        });
        const endDate = value[1].format("YYYY-MM-DD").split("-").map((item) => {
            return parseInt(item)
        });
        let soNgay = getSoNgay(startDate, endDate)
        setTime(soNgay)
    }, [])
    const handleClick = useCallback(() => {
        let urlNew = "https://servertripnest-4.onrender.com/api/bdsDuLich";
        urlNew += "?diaChi=" + queryDiaDiem;
        urlNew += "&loaiPhong=" + queryTypeRoom;
        if (querryTime > 0) {
            urlNew += "&thoiGianChoThue=" + querryTime;
        }
        // setUrl(urlNew)
        navigate("/list-bds")
    })

    useEffect(() => {
        fetch(`${apiUrl}bds?page=${currentPage}`)
            .then(async res => {
                const data = res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            })
            .then((responeFromServer) => {
                if (responeFromServer.success) {
                    setAccommodations(responeFromServer.data);
                    setCurrentPage(responeFromServer.currentPage);
                    setTotalPage(responeFromServer.totalPage);
                }
            }).catch(ex => {
                Swal.fire({
                    icon: "error",
                    title: "Oops!!",
                    text: ex,
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
    }, [currentPage])

    useEffect(() => {
        fetch(`${apiUrl}province/only-province`)
            .then(async res => {
                const data = res.json();
                if (!res.ok) throw new Error(data.message);
                return data;
            }).then(data => {
                setProvinceFilter(data)
            }).catch(ex => {
                Swal.fire({
                    icon: "error",
                    title: "Oops!!",
                    text: ex,
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
        // fetch("https://servertripnest-4.onrender.com/api/loaiPhong")
        //     .then(res => res.json())
        //     .then(data => {
        //         setLoaiP(data)
        //     })
    }, [])
    return (
        <>
            <div className="bdslist">
                <div className="bdslist__container">
                    <div className="banner">
                        <div className="banner__container">
                            <div className="banner__opacity"></div>
                            <div className="banner__title">
                                <h1>Danh Sách BĐS Du Lịch</h1>
                                <p>Hãy khám phá những HomeStay/Villa tốt nhất ở mọi địa điểm, điểm bắt đầu chuyến hành trình kỳ diệu của bạn</p>
                            </div>
                        </div>
                    </div>
                    <SlideUuDai />
                    <div className="search">
                        <div className="search__container">
                            <div className="search__box">
                                <Select
                                    prefix={<IoLocation style={{ color: '#0294F3' }} />}
                                    defaultValue="Lọc Theo Tỉnh/Thành Phố"
                                    style={{ width: 298, height: 70, fontSize: 18, fontWeight: 700, borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                                    onChange={handleChange}
                                    options={provinceFilter}
                                />
                            </div>
                            <div className="search__box">
                                <RangePicker
                                    onChange={TDTime}
                                    format="YYYY-MM-DD"
                                    prefix={<MdDateRange style={{ color: '#0294F3' }} />}
                                    style={{ width: 298, height: 70, fontSize: 26, fontWeight: 600, borderRadius: 0 }}
                                    className="box" />
                            </div>
                            <div className="search__box">
                                <Select
                                    className="box"
                                    defaultValue="Villa"
                                    style={{ width: 298, height: 70, fontSize: 18, fontWeight: 700, borderRadius: 0 }}
                                    onChange={TDLoaiPhong}
                                    options={loaiPhong}
                                />
                            </div>
                            <button onClick={handleClick}><IoSearch /></button>
                        </div>
                    </div>
                    <Outlet context={{ accommodations, currentPage, totalPage, onPageChange }} />
                </div>
            </div >
        </>
    )
}
export default BDSList