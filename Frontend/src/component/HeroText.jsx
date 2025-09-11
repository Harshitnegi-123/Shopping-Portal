import React from "react";
import { useState,useEffect } from "react";
export default function HeroText() {
    const lines = [
        "Kiranakart",
        "Experience hassle-free online grocery shopping with us.",
        "Fast, affordable, and convenient grocery shopping.",
    ]
    const [index, setIndex] = useState(0)
    const [animate, setanimate] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
            setanimate(false)
            setTimeout(() => {
                setIndex((prevIndex) => (prevIndex + 1) % lines.length)
                setanimate(true)
            }, 500);// half second for fade-out before text change
        }, 5000) // every 5 seconds change text
        return () => clearInterval(interval)
    }, [])

    return (
        <h1 className={`font-extrabold transition-all duration-500 leading-snug text-lg md:text-2xl lg:text-3xl  h-[50px] lg:h-[120px] md:h-[120px] max-w-md mb-4 ${animate ? "scale-y-100" : "scale-y-0"}`}>
        {lines[index]}
    </h1>
)
}
