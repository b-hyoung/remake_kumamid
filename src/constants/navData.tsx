import {years,headerList, IntroNavItem} from '../types/navigation'

export const yearData: years[] = [
    { year: 2025, status: 'active', path: { pathname: "/intro", query: { year: 2025 } } },
    { year: 2024, status: 'coming_soon', message: '준비중입니다!' },
    { year: 2023, status: 'active', path: { pathname: "/intro", query: { year: 2023 } } },
    // { year: 2022, status: 'disabled' } // 나중에 비활성화된 버튼도 쉽게 추가 가능
];


export const headerNav = (currentYear: number): headerList[] => [
    { page: "intro", label: "Exhibition", path: { pathname: "/intro", query: { year: currentYear } } },
    { page: "about", label: "About", path: { pathname: "/about", query: { year: currentYear } } },
    {
        page: "works",
        label: "Works",
        path: { pathname: "/works", query: { year: currentYear } },
        subItems: [
            // 서브 메뉴는 간단한 string path로 처리해도 좋습니다.
            { page: "post", label: "포스터", path: `/works?year=${currentYear}&tab=post` },
            { page: "video", label: "비디오", path: `/works?year=${currentYear}&tab=video` },
            { page: "team", label: "TVCF (팀)", path: `/works?year=${currentYear}&tab=team` },
        ]
    },
    { page: "designer", label: "Designer", path: { pathname: "/designer", query: { year: currentYear } } },
    { page: "thanksTo", label: "Thanks to", path: { pathname: "/thanksto", query: { year: currentYear } } },
];
    
    export const introNav = (currentYear: number): IntroNavItem[] => [
        { label: 'Works', path: { pathname: '/works', query: { year: currentYear } } },
        { label: 'Designer', path: { pathname: '/designer', query: { year: currentYear } } },
        { label: 'Thanks To', path: { pathname: '/thanksto', query: { year: currentYear } } },
    ];    