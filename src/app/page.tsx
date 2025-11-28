"use client"
import { yearData } from "@/constants/navData";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen overflow-hidden relative flex flex-col items-center justify-center">
      {/*<!-- 🔴 비디오 오버레이 및 영상 --> */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-60">
        <video className="w-full h-full object-cover"
          src="/video/2025_intro.mp4"
          autoPlay loop muted playsInline
        />
      </div>

      {/*<!-- 🔵 연도 목록 모듈 삽입 영역 -->*/}
      <div className="z-20 w-full max-w-4xl text-5xl cursor-pointer">
        <div className="text-white/70 font-extralight gap-20 flex flex-row justify-center
          
          /* 👇 [&>p]를 [&>*]로 변경: p태그와 Link(a태그) 모두에게 스타일 적용 */
          [&>*]:transition-colors
          [&>*]:duration-300
          [&>*]:hover:text-white
        ">

          {yearData.map((item) => {
            // 1. 활성화 상태 (Link 사용)
            if (item.status === 'active' && item.path) {
              return (
                <Link
                  key={item.year}
                  href={item.path}
                  className={item.year === 2025 ? "font-semibold" : ""} // 2025년만 기본적으로 밝게/굵게
                >
                  {item.year}
                </Link>
              );
            }

            // 2. 준비중 상태 (p 태그 + alert)
            return (
              <p
                key={item.year}
                onClick={() => item.message && alert(item.message)}
              >
                {item.year}
              </p>
            );
          })}

        </div>
      </div>

      {/*<!-- 하단 설명 -->*/}
      <div className="absolute bottom-10 z-20 text-center text-white/80 text-sm leading-relaxed font-light">
        <p>
          한국영상대학교 영상디자인학과 졸업작품 전시회<br />
          Exhibition of Graduation Projects from the Department of Film Design at Korea National University of Arts
        </p>
      </div>
    </div>

  )
}
