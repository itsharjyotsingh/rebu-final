import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { CloseIcon, CubeIcon } from "../../Components/Icons";
import { AnimatePresence, motion } from "framer-motion";
import A from "../../Assets/Rooms/A.png";
import B from "../../Assets/Rooms/B.jpeg";
import C from "../../Assets/Rooms/C.jpg";
import { BASE_URL } from "../../Config/url";
import Error from "../../Components/Error";
// import { useCallback } from "react";
export default function Rooms() {
    const [cars, setRooms] = useState([]);
    const [error, setError] = useState(null);
    // const [carNumber, setRoomNumber] = useState(0);

    const [isOpen, setIsOpen] = useState(false);

    const handleModal = (val) => {
        setIsOpen(val);
    };

    const getAllCars = async () => {
        const res = await fetch(`${BASE_URL}/cars/all`);
        const data = await res.json();
        setRooms(data.cars);
    };
    

    const handleClick = async (carNumber) => {
        // console.log(carNumber);
        try {
            const res = await fetch(`${BASE_URL}/cars/deleteByNumber/${carNumber}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if(res.status === 200) {
                // fetch again the list of available cars
                getAllCars();
            }
            else{
                
                setError("Error");
                console.log("Error");
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getAllCars();
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.2,
            }}
            className="flex flex-col gap-5 h-full overflow-hidden"
        >
            <div className="flex justify-between items-center">
                <h1 className="text-4xl lg:text-5xl font-black flex items-center gap-2">
                    Cars
                    <span>
                        <CubeIcon className="w-10 h-10" />
                    </span>
                </h1>
                <button
                    onClick={() => handleModal(true)}
                    className="hover:scale-105 transition-all ease-linear"
                >
                    <CloseIcon className="rotate-45 w-8 h-8" />
                </button>
            </div>

            <div className="border-t border-gray-400"></div>

            <div className="flex flex-col justify-center items-center md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-3 overflow-auto">
                {cars.map((car) => {
                    return (
                        <div className="min-w-[15rem] max-w-[16rem] min-h-[12rem] relative shadow-md hover:shadow-xl transition-all ease-linear rounded-2xl flex flex-col overflow-hidden bg-white">
                            <div className="h-24 w-full">
                                <img
                                    src={
                                        (car.carType === "Standard" && A) ||
                                        (car.carType === "Deluxe" && B) ||
                                        (car.carType === "Supreme" && C)
                                    }
                                    alt="background"
                                    className="w-full h-full object-cover object-center"
                                />
                            </div>
                            <div className="flex justify-between text-sm px-2 pt-4 pb-1">
                                <p className="bg-gray-200 px-4 py-1 text-md font-medium rounded-full">
                                    Car No. {car.carNumber}
                                </p>
                            </div>
                            <div className="flex justify-between text-sm px-2 pt-4 pb-1">
                                <button
                                    onClick={()=>{
                                        // setRoomNumber(car.carNumber);
                                        handleClick(car.carNumber);
                                    }}
                                    name="delete"
                                    value={car.carNumber}
                                    className="bg-gray-200 px-4 py-1 text-md font-medium rounded-full"
                                >
                                    delete
                                </button>
                            </div>
                            <div className="h-full px-3 py-2 ">
                                <h1 className="text-2xl font-bold">
                                    {car.carType}
                                </h1>
                                <p className="text-xl font-semibold">
                                    ₹{car.price}{" "}
                                    <span className="text-[14px] text-gray-400 font-normal">
                                        /per hour
                                    </span>{" "}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>


            <AnimatePresence>
                {isOpen && <Modal handleModal={handleModal} getAllCars={getAllCars}/>}
                {error !== null && <Error error={error} />}
            </AnimatePresence>
        </motion.div>
    );
}
