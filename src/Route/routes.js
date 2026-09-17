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
import CreateUser from "../pages/admin/users/create";
import ProtectedLayoutHost from "../layouts/host/protected/protected-layout";
import LayoutDefaultHost from "../layouts/host/default/default";
import ManageCategory from "../pages/admin/category/category";
import CreateCategory from "../pages/admin/category/create";

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
    path: "/admin",
    element: <ProtectedLayoutAdmin />,
    children: [
        {
            path: "",
            element: <LayoutDefault />,
            children: [
                {
                    path: "accommodation",
                    children: [
                        {
                            path: "",
                            element: <QuanTri />, // Trang danh sách: /admin/accommodation
                        },
                        {
                            path: "detail/:id",
                            element: <ChiTiet />, // Trang chi tiết: /admin/accommodation/detail/:id
                        },
                        {
                            path: "kiem-duyet",
                            element: <Check />, // Trang kiểm duyệt: /admin/accommodation/kiem-duyet
                        },
                    ],
                },
                {
                    path: "user",
                    children: [
                        {
                            path: "",
                            element: <ManageUser />, // /admin/user
                        },
                        {
                            path: "detail/:id",
                            element: <UserDetail />, // /admin/user/detail/:id
                        },
                        {
                            path: "edit/:id",
                            element: <EditUser />, // /admin/user/edit/:id
                        },
                        {
                            path: "create",
                            element: <CreateUser />, // /admin/user/create
                        },
                    ],
                },
                {
                    path: "categories",
                    children: [
                        {
                            path: "",
                            element: <ManageCategory />
                        },
                        {
                            path: "create",
                            element: <CreateCategory />
                        }
                    ]
                }
            ],
        },
    ],
},
{
    "path": "/admin/auth",
    children: [
        {
            path: "login",
            element: <Login />
        }
    ]
},
{
    path: "/host",
    element: <ProtectedLayoutHost />,
    children: [
        {
            path: "",
            element: <LayoutDefaultHost />,
            children: [
                {
                    path: "accommodation",
                    children: [
                        {
                            path: "",
                            element: <QuanTri />, // URL: /host/accommodation
                        },
                        {
                            path: "create",
                            element: <CreateAccommodation />, // URL: /host/accommodation/create
                        },
                        {
                            path: "edit/:id",
                            element: <EditProperty />
                        }
                    ],
                },
            ],
        },
    ],
}
]