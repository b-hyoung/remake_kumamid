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
    // 스크롤 다운 시 색 변경 애니메이션
    const headerClass = `fixed top-0 left-0 w-full min-h-[100px] z-50 flex flex-col shadow-md transition-colors duration-300
                        ${!isScrolled ? 'bg-white text-black' : 'bg-black text-white'}`

    return (
        <>
        {currentPathname != "/" ? 
            <header className={headerClass}>
                <div className="selectYear h-[45px] p-1 border-b border-gray-500">
                    <div className="year-selector absolute right-15 top-1 flex flex-row gap-7 text-[15px] p-2 text-bold">
                        {yearData.map((item: years) => {
                            if (item.status === "active" && item.path) {
                                return (
                                    <Link key={item.year} href={item.path} className={item.year == currentYear ? "text-[17px] text-[#ff6363] font-semibold" : 'text-[#30303080]'}>{item.year}</Link>
                                )
                            }else{
                                return (
                                    <div key={item.year} onClick={() => alert("아직 준비중입니다 !")} className={'text-[#30303080] cursor-pointer'}>{item.year}</div>
                                )
                            }
                        })}
                    </div>
                </div>

                <div className="inner flex flex-row pt-5">
                    <h1 className="logo absolute  top-13 left-15">
                        <Link href={navItems[0].path}>
                            <Image
                            className="align-middle" 
                            src="/img/kumamid_profile.png"
                            alt="kumamid logo"
                            width={200}
                            height={40}
                            priority
                              />
                        </Link>
                    </h1>
                    <label className="menu-icon text-[30px] md-block absolute right-5 " htmlFor="menu-toggle">&#9776;</label>
                    <nav className="nav flex flex-row align-center m-auto">
                        <ul className="flex space-x-8 item-center">
                            {navItems.map((item: headerList) => {
                                const linkPathname = getPathname(item.path);
                                const isActiveLink = currentPathname === linkPathname;
                                const linkClassName = `${isActiveLink ? 'text-black' : 'text-[#30303080]'} font-medium tracking-wider text-lg`;
                                const liBorderClass = isActiveLink ? "border-b-[5px] border-[#ff6363]" : "";

                                //work인 경우에는 드롭다운 형태로 출력
                                if (item.subItems) {
                                    return (
                                        <li key={item.page} className={`relative dropdown pb-[12px] group ${liBorderClass}`}>
                                            <Link href={item.path} className={`${linkClassName} block w-full`}>{item.label}</Link>
                                            <ul className="absolute top-11 left-0 dropdown-menu hidden group-hover:block transition-all duration-300 ease-out transform opactity-0
                                             bg-gray-100 shadow-lg rounded-md py-3 w-55 duration-300 ">
                                                {item.subItems.map((subItem: headerList) => {
                                                    const subLinkPathname = getPathname(subItem.path);
                                                    const isSubActiveLink = currentPathname === subLinkPathname;
                                                    const subLinkClassName = isSubActiveLink ? 'text-header-default' : 'text-gray-700';
                                                    return (
                                                        <li key={subItem.page} className="px-8 py-3">
                                                            <Link href={subItem.path} className={`${subLinkClassName} block w-full`}>{subItem.label}</Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li key={item.page} className={`${liBorderClass} pb-3 `}>
                                            <Link href={item.path} className={linkClassName}>{item.label}</Link>
                                        </li>
                                    );
                                }
                            })}
                        </ul>
                    </nav>
                </div>
            </header>
            :
            <></> }
        </>
    );
}