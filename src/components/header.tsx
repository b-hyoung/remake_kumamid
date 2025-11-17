"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { headerNav, yearData } from '../constants/navData';
import { headerList, years } from "../types/navigation";

export default function Header() {
    const params = useSearchParams();
    const currentYear = parseInt(params.get("year") || "2025");
    const navItems = headerNav(currentYear);

    return (
        <>
            <header className="header">
                <div className="selectYear">
                    <div className="year-selector">
                        {yearData.map((item: years) => {
                            if (item.status === "active" && item.path) {
                                return (
                                    <Link key={item.year} href={item.path}>{item.year}</Link>
                                )
                            }else{
                                return (
                                    <div key={item.year} onClick={() => alert("아직 준비중입니다 !")}>{item.year}</div>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>

                <div className="inner">
                    <h1 className="logo">
                        <a href="/index.html">
                            <img src="/img/kumamid_profile.png" alt="kumamid logo" style={{ height: '40px', verticalAlign: 'middle' }} />
                        </a>
                    </h1>
                    <input type="checkbox" id="menu-toggle" />
                    <label htmlFor="menu-toggle" className="menu-icon">&#9776;</label>
                    <nav className="nav">
                        <ul>
                            {navItems.map((item: headerList) => {
                                if (item.subItems) {
                                    return (
                                        <li key={item.page} className="dropdown">
                                            <Link href={item.path}>{item.label}</Link>
                                            <ul className="dropdown-menu">
                                                {item.subItems.map((subItem: headerList) => (
                                                    <li key={subItem.page}>
                                                        <Link href={subItem.path}>{subItem.label}</Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    );
                                } else {
                                    return (
                                        <li key={item.page}>
                                            <Link href={item.path}>{item.label}</Link>
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