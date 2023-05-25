import React, { useEffect, useState } from "react";
import avatar from "../../Assets/avatar.png";
import Lottie from "lottie-react";
import Success from "../../Assets/Lotties/Success.json";
import Loader from "../../Assets/Lotties/Loader.json";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../Config/url";
import Error from "../../Components/Error";

export default function BookNow() {

    const navigate = useNavigate();

    useEffect(() => {
        if(localStorage.getItem("user") === null){
            navigate("/");
        }
    }, []);


    // const user = localStorage.getItem("user");
    // if(!user){
    //     navigate("/login");
    // }

    const [data, setData] = useState({
        username: "",
        email: "",
        carType: "",
        carNumber: null,
        startTime: 0,
        endTime: 0,
    });

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [error, setError] = useState(null);


    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    // function to convert normal date to unix time stamp
    const convertToUnix = (date) => {
        const unixTime = new Date(date).getTime();
        return unixTime;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading1(true);

        const { username, email, carType, startTime, endTime } = data;
        // we are sending userID from local storage so bookings can be compared with their stored user id with these bookings
        const userID = await JSON.parse(localStorage.getItem("user")).user._id;
        // console.log(userID, "userID from booknow.js") // working hai
        // console.log(userID, "userID from booknow.js")
        const unixStartTime = convertToUnix(startTime);
        const unixEndTime = convertToUnix(endTime);

        try {
            const response = await fetch(`${BASE_URL}/bookings/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    xFormUrlEncoded: "true",
                },
                body: JSON.stringify({
                    userID,
                    username,
                    email,
                    carType,
                    startTime: unixStartTime,
                    endTime: unixEndTime,
                }),
            });

            const data = await response.json();

            setLoading1(false);

            if (data.error) {
                setError(data.error);
            } else {
                setLoading2(true);
                setTimeout(() => {
                    setLoading2(false);
                    navigate("/dashboard");
                }, 1000);
            }
        } catch (err) {
            setLoading1(false);
            setError(err.message);
            <Error error={error} />;
        }
    };
    // useEffect(() => {
    //     if (!user) {
    //         navigate("/login");
    //     }
    // });

    useEffect(() => {
        setTimeout(() => {
            setError(null);
        }, 3000);
    }, [error]);


    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="flex flex-col xl:flex-row gap-10">
                <div className="w-full xl:w-[25%] flex flex-col justify-center xl:justify-start items-center xl:items-start gap-10">
                    <div>
                        <img
                            src={avatar}
                            alt="profile_picture"
                            className="w-24 rounded-full"
                        />
                    </div>

                    <div className="text-md text-gray-500">
                        <p className="text-center xl:text-left">
                            Enter the required information to register.
                        </p>
                        <p className="text-center xl:text-left ">
                            {" "}
                            These are editable.{" "}
                        </p>
                    </div>
                </div>

                {/* username, email, carType, startTime, endTime, carNumber  */}
                <div className="flex flex-col md:flex-row gap-5 xl:gap-10 justify-between flex-1">
                    <div className="flex-1 flex flex-col gap-4">
                        {/* Username */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-lg">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                onChange={handleChange}
                                placeholder="ApkHarsh"
                                required
                                className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="" className="text-lg">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                onChange={handleChange}
                                placeholder="apkharsh@gmail.com"
                                required
                                className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                            />
                        </div>

                        {/* Car Details */}
                        <div className="flex gap-3">
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="" className="text-lg">
                                    Car No.
                                </label>
                                <input
                                    type="text"
                                    name="carNumber"
                                    onChange={handleChange}
                                    placeholder="Optional"
                                    className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <label htmlFor="" className="text-lg">
                                    Car Type
                                </label>

                                <select
                                    className="outline-none w-full px-2 py-3 border rounded-md shadow focus:shadow-lg transition-all"
                                    name="carType"
                                    id=""
                                    onChange={handleChange}
                                >
                                    <option value="" disabled selected className="hidden"></option>
                                    <option value="Sedan">Sedan</option>
                                    <option value="Hatchback">Hatchback</option>
                                    <option value="SUV">SUV</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Check-in-out */}
                    <div className="md:w-[40%] lg:w-[45%] flex flex-col justify-center items-center gap-4">
                        <div className="rounded-md border px-4 py-5 w-full h-full bg-white flex flex-col justify-between shadow hover:shadow-lg transition-all ease-linear">
                            <input
                                type="datetime-local"
                                name="startTime"
                                id=""
                                className="text-2xl font-bold outline-none"
                                onChange={handleChange}
                                required
                            />
                            <p className="text-[16px] text-gray-600"> Start </p>
                        </div>
                        <div className="rounded-md border px-4 py-5 w-full h-full bg-white flex flex-col justify-between shadow hover:shadow-lg transition-all ease-linear">
                            <input
                                type="datetime-local"
                                name="endTime"
                                id=""
                                required
                                className="text-2xl font-bold outline-none"
                                onChange={handleChange}
                                // onfocus={this.showPicker()}
                            />
                            <p className="text-[16px] text-gray-600"> End </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex item-center w-full justify-end mt-5">
                <button
                    onClick={handleSubmit}
                    className="px-2 w-full xl:w-52 py-6 rounded-xl bg-black text-white hover:bg-[#000000] hover:shadow-xl transition-all"
                >
                    Book
                </button>
            </div>

            <AnimatePresence>
                {loading1 && (
                    <div className="bg-[#FDFDFD] bg-opacity-90 w-full h-full absolute top-0 left-0 flex items-center justify-center">
                        <Lottie
                            animationData={Loader}
                            className="w-[10rem]"
                            loop={false}
                        />
                    </div>
                )}
                {loading2 && (
                    <div className="bg-[#FDFDFD] bg-opacity-90 w-full h-full absolute top-0 left-0 flex items-center justify-center">
                        <Lottie
                            animationData={Success}
                            className="w-[10rem]"
                            loop={false}
                        />
                    </div>
                )}
                {error !== null && <Error error={error} />}
            </AnimatePresence>
        </form>
    );
}
