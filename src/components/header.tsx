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

export default function Header() {
    const params = useSearchParams(); 
    const currentYear = parseInt(params.get("year") || "2025"); // 선택된 파라미터 년도 , 없으면 2025
    const currentPathname = usePathname();
    const navItems = headerNav(currentYear); // 헤더 값
    console.log("curr : " + currentPathname)

    const [isScrolled , setIsScrolled] = useState(false) // 헤더 백그라운드 애니메이션 처리를 위한 변수

    // 스크롤이 50px아래로 내려가면 애니메이션 실행
    useEffect(() => {
        const handleScroll = () =>{
            if(window.scrollY > 50){
                setIsScrolled(true)
            }else{
                setIsScrolled(false)
            }
        }
        window.addEventListener('scroll' , handleScroll)
        return () => window.removeEventListener('scroll' , handleScroll)
    },[])

    const headerClass = `fixed top-0 left-0 w-full min-h-[95px] z-50 flex flex-col shadow-md transition-colors duration-300
                        ${!isScrolled ? 'bg-white text-black' : 'bg-black text-white'}`
    const textColorClass = !isScrolled ? 'text-black' : 'text-white';

    return (
        <>
            <header className={headerClass}>
                <div className="selectYear h-[40px] border-b border-gray-300">
                    <div className="year-selector absolute right-5 top-2 flex flex-row gap-5">
                        {yearData.map((item: years) => {
                            if (item.status === "active" && item.path) {
                                return (
                                    <Link key={item.year} href={item.path} className={textColorClass}>{item.year}</Link>
                                )
                            }else{
                                return (
                                    <div key={item.year} onClick={() => alert("아직 준비중입니다 !")} className={textColorClass}>{item.year}</div>
                                )
                            }
                        })}
                    </div>
                </div>

                <div className="inner flex flex-row">
                    <h1 className="logo absolute  top-12 left-3">
                        <Link href={navItems[0].path}>
                            <Image
                            className="align-middle" 
                            src="/img/kumamid_profile.png"
                            alt="kumamid logo"
                            width={150}
                            height={50}
                            priority
                              />
                        </Link>
                    </h1>
                    <label className="menu-icon " htmlFor="menu-toggle">&#9776;</label>
                    <nav className="nav flex flex-row align-center m-auto">
                        <ul className="flex space-x-8 item-center mt-[16px]">
                            {navItems.map((item: headerList) => {
                                const linkPathname = getPathname(item.path);
                                const isActiveLink = currentPathname === linkPathname;
                                const linkClassName = `${isActiveLink ? 'text-black' : 'text-[#30303080]'} font-midium text-lg`;

                                //work인 경우에는 드롭다운 형태로 출력
                                if (item.subItems) {
                                    return (
                                        <li key={item.page} className="dropdown">
                                            <Link href={item.path} className={linkClassName}>{item.label}</Link>
                                            <ul className="dropdown-menu hidden">
                                                {item.subItems.map((subItem: headerList) => {
                                                    const subLinkPathname = getPathname(subItem.path);
                                                    const isSubActiveLink = currentPathname === subLinkPathname;
                                                    const subLinkClassName = isSubActiveLink ? 'text-header-default' : textColorClass;
                                                    return (
                                                        <li key={subItem.page}>
                                                            <Link href={subItem.path} className={subLinkClassName}>{subItem.label}</Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li key={item.page}>
                                            <Link href={item.path} className={linkClassName}>{item.label}</Link>
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                    </nav>
                </div>
            </header>
        </>
    );
}