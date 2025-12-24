"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { headerNav, yearData } from '../constants/navData';
import { headerList, years } from "../types/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UrlObject } from "url";

// Helper function to extract pathname
function getPathname(path: UrlObject | string): string {
    if (typeof path === 'string') {
        return path.split('?')[0];
    }
    // If it's not a string, it's an UrlObject
    return path.pathname ?? '';
}

// Sub-component for Desktop Navigation to isolate state and fix animation bug
function DesktopNavigation({ navItems, currentPathname, currentYear, isScrolled }: { navItems: headerList[], currentPathname: string, currentYear: number, isScrolled: boolean }) {
    const [animateDesktopUnderline, setAnimateDesktopUnderline] = useState(false);

    useEffect(() => {
        // Trigger animation on component mount. The key change will cause a re-mount.
        const timer = setTimeout(() => {
            setAnimateDesktopUnderline(true);
        }, 150);
        return () => clearTimeout(timer);
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <nav className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 items-end gap-4 lg:gap-6 xl:gap-10 h-full">
            {navItems.map((item: headerList) => {
                const linkPathname = getPathname(item.path);
                const isActive = item.subItems 
                    ? currentPathname.startsWith(linkPathname)
                    : currentPathname === linkPathname;

                const displayLabel = item.page === 'intro' ? `${item.label} ${currentYear}` : item.label;
                
                const activeClass = isScrolled ? "text-white font-bold" : "text-[#434343] font-bold";
                const inactiveClass = isScrolled 
                    ? "text-gray-300 font-bold hover:text-white transition-colors"
                    : "font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 from-50% to-[rgba(48,48,48,0.5)] to-50% bg-[length:200%_100%] bg-[position:100%] hover:bg-[position:0%] transition-background-position duration-500 ease-in-out";

                return (
                    <div key={item.page} className="relative h-full flex items-end group pb-3"> {/* items-end and pb-2 here */}
                        <Link 
                            href={item.path} 
                            className={`${isActive ? activeClass : inactiveClass} text-sm lg:text-base xl:text-base px-2`}
                        >
                            {displayLabel}
                        </Link>
                        
                        {/* Active Underline */}
                        {isActive && (
                            <div 
                                className="absolute bottom-0 left-0 w-full h-[5px] bg-red-500 origin-left transition-transform duration-700 ease-linear" 
                                style={{ transform: animateDesktopUnderline ? 'scaleX(1)' : 'scaleX(0)' }} 
                            />
                        )}

                        {/* Dropdown for Works */}
                        {item.subItems && (
                            <>
                                <div className="absolute top-full h-4 w-full"></div>
                                <div className={`absolute top-full left-0 mt-2 hidden group-hover:block ${isScrolled ? "bg-black" : "bg-white"} shadow-lg rounded-md py-2 w-48`}>
                                    <ul className="flex flex-col">
                                        {item.subItems.map((subItem) => (
                                            <li key={subItem.page}>
                                                <Link href={subItem.path} className={`block px-6 py-2 ${isScrolled ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"} whitespace-nowrap`}>
                                                    {subItem.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </>
                        )}
                    </div>
                )
            })}
        </nav>
    );
}


export default function Header() {
    const params = useSearchParams();
    const currentYear = parseInt(params.get("year") || "2025");
    const currentPathname = usePathname();
    const navItems = headerNav(currentYear);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [animateUnderline, setAnimateUnderline] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            const timer = setTimeout(() => {
                setAnimateUnderline(true);
            }, 150);
            return () => clearTimeout(timer);
        } else {
            setAnimateUnderline(false);
        }
    }, [isMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const yearHeaderClass = `border-b transition-colors duration-300 ${isScrolled ? "bg-[#111] border-gray-800" : "bg-white border-[rgb(214,214,214)]"}`;
    const mainHeaderClass = `transition-colors duration-300 ${isScrolled ? "bg-[#111]" : "bg-white"}`;

    const YearLinks = () => (
        <div className="flex justify-end items-center gap-6 p-2 pr-4 md:pr-16">
            {yearData.map((item: years) => {
                const isActive = item.year === currentYear;
                if (item.status === "active" && item.path) {
                    return (
                        <Link key={item.year} href={item.path} className={isActive ? "text-[#ff6363] font-extrabold text-base" : `text-[14px] font-semibold ${isScrolled ? "text-gray-300 hover:text-white" : "text-[#6f6f6f] hover:text-[#6f6f6f]"}`}>
                            {item.year}
                        </Link>
                    )
                } else {
                    return (
                        <div key={item.year} onClick={() => alert(item.message || "준비중입니다 !")} className={`text-[14px] cursor-pointer font-semibold ${isScrolled ? "text-gray-300" : "text-[#6f6f6f]"}`}>
                            {item.year}
                        </div>
                    )
                }
            })}
        </div>
    );

    return (
        <>
            {currentPathname !== "/" && (
                <>
                    <header className="fixed top-0 left-0 w-full z-50 shadow-md">
                        {/* Year Selection Bar */}
                        <div className={yearHeaderClass}>
                            <YearLinks />
                        </div>

                        {/* Main Header */}
                        <div className={`${mainHeaderClass} relative flex items-center justify-between px-4 sm:px-6 lg:px-8 h-[60px]`}>
                            {/* Logo */}
                            <div className="logo ml-[60px]">
                                <Link href={{ pathname: '/intro', query: { year: currentYear } }}>
                                    <Image
                                        src={isScrolled ? "/img/kumamid_logoWhite.png" : "/img/kumamid_profile.png"}
                                        alt="kumamid logo"
                                        width={180}
                                        height={35}
                                        priority
                                    />
                                </Link>
                            </div>

                            {/* Desktop Navigation */}
                            <DesktopNavigation key={currentPathname} navItems={navItems} currentPathname={currentPathname} currentYear={currentYear} isScrolled={isScrolled} />

                            {/* Hamburger Menu Button */}
                            <div className="md:hidden">
                                <button onClick={() => setIsMenuOpen(true)} className={`text-3xl ${isScrolled ? "text-white" : "text-gray-800"}`}>
                                    &#9776;
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* Mobile Menu Overlay */}
                    {isMenuOpen && (
                        <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[100] flex flex-col items-center justify-center">
                            <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-xl font-semibold text-white">
                                &times;
                            </button>
                            <nav className="flex flex-col items-center gap-6 text-center">
                                {navItems.map((item: headerList) => {
                                    const linkPathname = getPathname(item.path);
                                    const isActive = currentPathname === linkPathname;
                                    
                                    const label = item.page === 'intro' ? `Exhibition ${currentYear}` : item.label;

                                    return (
                                        <div key={item.page} className="flex flex-col items-center gap-2">
                                            <Link href={item.path} className={`${isActive ? 'text-[#ff6363] font-bold' : 'text-white font-bold'} text-2xl hover:text-[#ff6363]`} onClick={() => setIsMenuOpen(false)}>
                                                {label}
                                            </Link>
                                            
                                            {isActive && (
                                                <div 
                                                    className="w-full h-1 bg-red-500 origin-left transition-transform duration-500 ease-out" 
                                                    style={{ transform: animateUnderline ? 'scaleX(1)' : 'scaleX(0)' }} 
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </nav>
                        </div>
                    )}
                </>
            )}
        </>
    );
}
