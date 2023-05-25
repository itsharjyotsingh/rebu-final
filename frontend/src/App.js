import { Route, Routes, Navigate, Link, useLocation } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Cancellation from "./Pages/Cancellation/Cancellation";
import BookIcon, {
    ArrowRight,
    CancelIcon,
    DashboardIcon,
    RoomsIcon,
} from "./Components/Icons";
import BookingTemp from "./Components/BookingTemp";
import Rooms from "./Pages/Rooms/Rooms";
import CancelRoutes from "./Routes/CancelRoutes";
import { useEffect, useState } from "react";
import Signup from "./Pages/Signup/Signup";
import Login from "./Pages/Login/Login";
import Panel from "./Components/Panel";
import { useNavigate } from "react-router-dom";


function App() {

    const user = localStorage.getItem("user");

    const navigate = useNavigate();
    const route = useLocation().pathname;
    const [newIndex, setIndex] = useState(0);
    const links = [
        {
            id: 1,
            name: "Dashboard",
            route: "/dashboard",
            icon: <BookIcon className="w-6 h-6" />,
        },
        {
            id: 2,
            name: "Booking",
            route: "/booking",
            icon: <DashboardIcon className="w-[19px] h-[19px]" />,
        },
        // {
        //       id: 3,
        //       name: "Cars",
        //       route: "/rooms",
        //       icon: <RoomsIcon className="w-6 h-6" />,
        //   },
        {
            id: 4,
            name: "Checkout",
            route: "/checkout",
            icon: <CancelIcon className="w-7 h-7" />,
        },
        {
            id: 5,
            name: "Logout",
            route: "/",
            icon: <CancelIcon className="w-7 h-7" />,
        },
    ];

    // if (route !== "/" && route !== "/signup" && route !== "/login") {
    if (user) {
        // means already logged in
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData.user.role === "admin") {
            var cars = {
                id: 3,
                name: "Cars",
                route: "/rooms",
                icon: <RoomsIcon className="w-6 h-6" />,
            };
            links.splice(2, 0, cars);
        }
    }

    useEffect(() => {
        if(!user){
            navigate("/");
        }
    }, []);

    return (
        <div className="text-black">
            <div className="flex">
                {/* Side-panel */}
                {route !== "/" && route !== "/signup" ? (
                    <div className="xl:w-[18rem] h-full min-h-screen px-2 py-9 hidden sticky top-0 md:flex flex-col gap-10 ">
                        <h1 className="font-bold text-2xl px-2"> REBU </h1>

                        <div className="flex flex-col gap-1">
                            {links.map((item, index) => {
                                return (
                                    <Link
                                        to={item.route}
                                        onClick={() => setIndex(index)}
                                        className={`flex justify-between gap-1 items-center  outline-none py-3 px-2 rounded-xl hover:scale-105 ease-linear transition-all
                    ${index === newIndex && "bg-stone-300"}
                  `}
                                        key={item.id}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <div className="w-7 flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <p> {item.name} </p>
                                        </div>
                                        <div>
                                            <ArrowRight className="w-[15px] h-[15px]" />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    ""
                )}

                {/* Content View */}
                <div className="overflow-hidden w-full">
                    {/* Mobile View Navigation */}
                    {route !== "/" && route !== "/signup" ? (
                        <div className="w-full flex md:hidden gap-2 px-2 py-2 overflow-x-auto scrollbar-hide">
                            {links.map((item, index) => {
                                return (
                                    <Link
                                        to={item.route}
                                        onClick={() => setIndex(index)}
                                        className={`flex justify-between gap-1 items-center  outline-none py-3 px-2 rounded-xl hover:scale-105 ease-linear transition-all
                    ${index === newIndex && "bg-stone-300"}
                  `}
                                        key={item.id}
                                    >
                                        <div className="flex gap-2 items-center">
                                            <div className="w-7 flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                            <p> {item.name} </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        ""
                    )}

                    {/* Main Routing */}
                    <div className="p-5 md:p-5 lg:p-10 w-full border min-h-screen shadow-xl shadow-p2 rounded-xl bg-gray-100 bg-opacity-20 overflow-hidden">
                        <Routes>
                            <Route path="/" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/booking" element={<BookingTemp />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/rooms" element={<Rooms />} />
                            <Route
                                path="/checkout/*"
                                element={<CancelRoutes />}
                            />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
