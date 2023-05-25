import React, { useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../Pages/Dashboard/Dashboard";
import BookIcon, {
    ArrowRight,
    CancelIcon,
    DashboardIcon,
    RoomsIcon,
} from "../Components/Icons";

function Panel() {
    const [newIndex, setIndex] =useState(0);
    const links = [
        {
            id: 1,
            name: "Dashboard",
            route: "/",
            icon: <BookIcon className="w-6 h-6" />,
        },
        {
            id: 2,
            name: "Booking",
            route: "/booking",
            icon: <DashboardIcon className="w-[19px] h-[19px]" />,
        },
        {
            id: 3,
            name: "Cars",
            route: "/rooms",
            icon: <RoomsIcon className="w-6 h-6" />,
        },
        {
            id: 4,
            name: "Checkout",
            route: "/checkout",
            icon: <CancelIcon className="w-7 h-7" />,
        },
        {
            id: 5,
            name: "Login",
            route: "/login",
            icon: <CancelIcon className="w-7 h-7" />,
        },
        {
            id: 6,
            name: "Sign Up",
            route: "/signup",
            icon: <CancelIcon className="w-7 h-7" />,
        },
    ];

    return (
        <div className="xl:w-[18rem] h-full min-h-screen px-2 py-9 hidden sticky top-0 md:flex flex-col gap-10 ">
            <h1 className="font-bold text-2xl px-2"> Panel </h1>

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
    );
}

export default Panel;
