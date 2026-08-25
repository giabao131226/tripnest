import Body from "../Component/Body/body";
import BDSList from "../Component/dsPhong/dsPhong";
import ChiTiet from "../Component/HienThiChiTiet/chitiet";
import KiemDuyet from "../Component/KiemDuyetTT/kiemduyet";
import LichSuDatPhong from "../Component/lichSuDatPhong/history";
import PageDefault from "../Component/PageDefault/Pagedefault";
import ProtectedLayout from "../Component/ProtectedLayout/protected-layout";
import QuanLyTaiKhoan from "../Component/QuanLyTaiKhoan/quanlytaikhoan";
import QueryRoom from "../Component/QueryRoom/queryroom";
import CreateAccommodation from "../Component/RegisterBoss/create";
import EditProperty from "../Component/RegisterBoss/edit";
import RegisterBoss from "../Component/RegisterBoss/registerboss";
import Terms from "../Component/terms/terms";
import LayoutDefault from "../layouts/admin/default";
import ProtectedLayoutAdmin from "../layouts/admin/protected/protected-layout";
import Login from "../pages/admin/auth/login";
import Check from "../pages/admin/accommodation/Check/Check";
import QuanTri from "../pages/admin/accommodation/QuanTri";
import ManageUser from "../pages/admin/users/user-manage";
import UserDetail from "../pages/admin/users/detail";
import EditUser from "../pages/admin/users/edit";

export const routes = [{
    path: "/",
    element: < PageDefault />,
    children: [{
        path: "/",
        element: < Body />,
    },
    {
        path: "/list-bds",
        element: < BDSList />,
        children: [{
            path: "",
            element: < QueryRoom />
        },
        {
            path: "detail/:id",
            element: < ChiTiet />
        }
        ]
    },
    {
        path: "/",
        element: < ProtectedLayout />,
        children: [
            {
                path: "your-property",
                children: [
                    {
                        path: "",
                        element: < RegisterBoss />,
                    },
                    {
                        path: "create",
                        element: <CreateAccommodation />
                    },
                    {
                        path: "edit/:slug",
                        element: <EditProperty />
                    }
                ]
            },
            {
                path: "terms",
                element: < Terms />
            },
            {
                path: "history-book",
                element: < LichSuDatPhong />
            },
            {
                path: "kiem-duyet",
                element: < KiemDuyet />
            },
            {
                path: "quan-ly-tai-khoan",
                element: < QuanLyTaiKhoan />
            }
        ]
    }
    ]
}
    ,
{
    "path": "/admin",
    "element": <ProtectedLayoutAdmin />,
    "children": [
        {
            "path": "",
            "element": <LayoutDefault />,
            "children": [
                {
                    "path": "accommodation",
                    "element": <QuanTri />
                },
                {
                    "path": "accommodation/kiem-duyet",
                    "element": <Check />
                },
                {
                    "path": "user",
                    "children": [
                        {
                            "path": "",
                            "element": <ManageUser />
                        },
                        {
                            "path": "detail/:id",
                            "element": <UserDetail />
                        },{
                            "path": "edit/:id",
                            "element": <EditUser />
                        }
                    ]
                    
                }
            ]
        }
    ]
},
{
    "path": "/admin/auth",
    children: [
        {
            path: "login",
            element: <Login />
        }
    ]
}
]