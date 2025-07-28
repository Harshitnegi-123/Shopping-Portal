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
        <h1 className={`text-2xl md:text-4xl font-extrabold transition-all duration-500 mb-4 ${animate ? "scale-y-100" : "scale-y-0"}`}>
        {lines[index]}
    </h1>
)
}
