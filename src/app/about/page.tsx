"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

// It is recommended to move this hook to a separate file in a hooks directory.
const useScrollFadeIn = () => {
  const dom = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  }, []);

  useEffect(() => {
    let observer: IntersectionObserver;
    const { current } = dom;

    if (current) {
      observer = new IntersectionObserver(handleScroll, { threshold: 0.1 });
      observer.observe(current);

      return () => observer && observer.disconnect();
    }
  }, [handleScroll]);

  return {
    ref: dom,
    style: {
      opacity: 0,
      transform: 'translateY(20px)',
      transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
    },
  };
};

const AboutPage = () => {
  const images = [
    '/img/about/대표이미지01.jpg',
    '/img/about/대표이미지02.jpg',
    '/img/about/모션3.jpg',
    '/img/about/모션6.jpg',
    '/img/about/미래2.jpg',
    '/img/about/촬영7.jpg',
    '/img/about/촬영8.jpg',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const animatedItem1 = useScrollFadeIn();
  const animatedItem2 = useScrollFadeIn();
  const animatedItem3 = useScrollFadeIn();
  const animatedItem4 = useScrollFadeIn();
  const animatedItem5 = useScrollFadeIn();

  return (
    <div className="bg-black text-white pt-30">
      <div className="flex flex-col lg:flex-row w-full h-auto lg:h-[500px] px-4 lg:px-[15%]">
        <div className="w-full lg:w-1/2 h-full relative overflow-hidden">
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, index) => (
              <div key={index} className="min-w-full h-full">
                <Image src={src} alt="" width={500} height={500} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full cursor-pointer ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                onClick={() => setCurrentIndex(index)}
              ></div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-black flex flex-col justify-end p-4 lg:pl-[5%]">
          <p className="text-sm text-gray-400 mb-2.5">Dept. of Moving Image Design</p>
          <h2 className="text-3xl mb-2.5">영상디자인학과</h2>
          <p className="text-lg leading-relaxed" style={{ letterSpacing: '-0.3px' }}>
            “창의력과 기획력, 시각적 감수성을 갖춘 영상디자이너!<br />무한한 상상력으로 영상세계로 이끌어갑니다.”
          </p>
        </div>
      </div>

      <div className="flex justify-center items-center h-20">
        <Image src="/img/icon/about_arrow.png" alt="arrow" width={15} height={20} />
      </div>

      <div {...animatedItem1} className="px-4 lg:px-[15%] text-white">
        <h1 className="text-2xl lg:text-3xl font-bold">한국영상대학교 영상디자인학과 소개</h1>
        <p className="mt-1 text-xl font-bold">
          디지털 영상콘텐츠디자인 전문가, 영상디자인/모션그래픽, 광고/방송/영상그래픽 디자이너
        </p>
        <p className="text-base mt-1.5 text-gray-200">
          ​창의력과 기획력, 시각적 감수성으로 스타일이 더 살아있는 영상, 다양한 스타일의 영상디자인과 모션그래픽으로 새로운 영상 시대에<br /> 자신의 아이디어를 맘껏 구사하고 제작할 수 있도록 광고, 방송, 영화, 웹, 모바일 콘텐츠, 뉴미디어 등 다양한 플랫폼의 영상제작 전분야로 진출 가능한 전문 영상디자이너를 양성합니다.<br /><br />
          영상커뮤니케이션 분야의 영상기술과 디자인이 융합된 커리큘럼과 실습위주의 교육을 통해<br /> 영상디자인 및 모션그래픽 분야의 기획, 연출, 촬영, 편집, 색보정, 음향, 2D/3D컴퓨터그래픽 애니메이션, 영상합성 VFX 포스트프로덕션, 뉴미디어 영상 등<br /> 최종적으로 다양한 스타일의 영상 작품을 직접 제작할 수 있도록 전 과정을 기초부터 실무능력까지 실기 중심의 교육을 하고 있습니다.<br />
          국내 최고 수준의 장비와 교수진, 그리고 매년 업그레이드해 온 기초부터 실무까지 탄탄하고 체계적인 교육과정을 통해<br /> 고부가가치의 영상을 제작할 수 있는 창의융합형 글로벌 인재양성을 목표로 합니다.
        </p>
      </div>

      <div {...animatedItem2} className="px-4 lg:px-[15%] mt-5 text-white">
        <h1 className="text-2xl mb-2.5">학과 연혁</h1>
        <div className="leading-6">
          <p>2025.3 '영상디자인학과'로 학과명칭 변경, 입학정원 65명 유지<br/>
          2025.3 (4학년 학사학위 전공심화과정)“영상디자인학과” 입학정원 20명에서 25명으로 증원<br/>
          2024.3 '영상디자인과' 입학정원 60명에서 65명으로 증원<br/>
          2023.3 취업률 1위 학과! 90.3%(건강/국세DB, ’21년도 졸업자, ’22.12.31.기준)<br/>
          2023.3 '영상디자인과'로 학과명칭 변경, 입학정원 60명 유지<br/>
          2023.3 (4학년 학사학위 전공심화과정)“영상디자인학과”로 학과명칭 변경, 입학정원 20명으로 조정<br/>
          2022.3 마이스터대학원 석사학위(전문기술석사과정) 디자인전공 2년제 개설 입학<br/>
          2021.6 석사학위, 마이스터대 단기직무교육과정 “실감콘테츠 지도자 세미나(현업적용사례 및 전망)”너<br/>
          2021.5 석사학위(전문기술석사과정) 2년제 개설 승인, 마이스터대 시범운영사업 선정<br/>
          2020.3 취업률 1위 학과! 88.6%(건강/국세DB, ’18년도 졸업자, ’19.12.31.기준)<br/>
          2016.3 4학년 학사학위(전공심화과정) 개설 “광고영상디자인학과” 정원20명<br/>
          2014.3 취업률 우수 학과 선정!<br/>
          2012.8 취업률 우수 학과 선정!<br/>
          2012. 3 광고영상디자인과 입학정원 50명으로 증원<br/>
          2007.3 4학년 학사학위(전공심화과정) ‘영상연출과’로 공동개설<br/>
          2005.3 '광고영상디자인과'로 학과명칭 변경, 입학정원 50명 유지<br/>
          2004.3 '광고영상디자인전공'으로 학과명칭 변경(방송영상제작계열), 입학정원 50명<br/>
          2002.3 '영상그래픽전공'으로 학과명칭 변경, 3년제로 전환(애니메이션디자인계열)<br/>
          2000.3 '영상그래픽과'로 학과명칭 변경(방송영상제작계열), 입학정원 40명<br/>
          1999.3 '그래픽디자인과' 신설 (방송영상제작계열), 입학정원 40명</p>
        </div>
      </div>
      
      <div {...animatedItem3} className="px-4 lg:px-[15%] mt-5 text-white">
        <h3 className="text-xl font-bold">교육 목표</h3>
        <div>
          <p>광고, 방송, 영화, 웹, 모바일 콘텐츠, 뉴미디어 등 다양한 플랫폼의 영상제작 전 분야로 진출 가능한 전문 영상디자이너를 양성<br />
              새로운 시각적 자극을 전달하는 영상디자이너 양성<br />
              다양한 스타일의 모션그래픽 디자이너 양성<br />
              고부가가치의 영상을 제작할 수 있는 창의?융합형 글로벌 인재양성</p>
        </div>
      </div>

      <div {...animatedItem4} className="px-4 lg:px-[15%] mt-5 text-white">
        <h3 className="text-xl font-bold">학과 특색</h3>
        <div>
          <p>[3년제 전문학사 + 4년제 학사학위 전공심화과정 + 석사과정(마이스터 대학원)] 후 박사과정으로의 연계를 통한 미래 지식인 양성<br />
              다양한 영상디자인 분야 전공 동아리 및 특강, 현장실습교육, 대학의 IPTV 방송 참여 등을 통해 산업체가 인정하는 현장밀착형 현장중심 실무교육<br />
              우수한 국내·외 공모전 수상 실적과 공모전 출품을 통한 아이디어와 디자인감각을 배양하는 교육<br />
              취업률 우수학과 : 88.6%(건강/국세DB, KEDI발표 2019.12.31일자)<br />
              세계 대학 최고 수준의 최신 기자재 및 시설, UHD(4K)/HD 스튜디오, 전문가용 1인 미디어 실습실, 컴퓨터그래픽실습실, 전문 방송영상 촬영/편집/음향 장비 및 기자재,
              방송중계차 등 공동 활용<br />
              전, ‘광고영상디자인과’에서 ‘영상디자인과’로 명칭 변경, 2023학년도부터 적용됨</p>
        </div>
      </div>

      <div {...animatedItem5} className="text-white mt-5">
        <div className="text-center">
            <div>웅진관 1층 2102 통합사무실<br />
                <div>학과장 : 044-850-9362 조교 : 044-850-9390</div>
            </div>
        </div>
        <div className="w-[70%] my-3 mx-auto flex items-center">
            <div className="flex items-center gap-2.5 flex-wrap max-w-md">
                <a href="https://www.instagram.com/creative_md_kuma?igsh=cnlidmlxeG92ajl4" target="_blank">
                    <Image src="/img/icon/sns_in.png" alt="Instagram" width={30} height={30} className="object-contain" />
                </a>
                <a href="https://www.youtube.com/@한국영상대영상디자인" target="_blank">
                    <Image src="/img/icon/sns_yu.png" alt="YouTube" width={30} height={30} className="object-contain" />
                </a>
                <a href="https://www.facebook.com/kuma.ads" target="_blank">
                    <Image src="/img/icon/sns_fa.png" alt="Facebook" width={30} height={30} className="object-contain" />
                </a>
                <a href="https://blog.naver.com/advertising2020" target="_blank">
                    <Image src="/img/icon/sns_blog.png" alt="Blog" width={30} height={30} className="object-contain" />
                </a>
                <a href="https://cafe.naver.com/kumaamd" target="_blank">
                    <Image src="/img/icon/sns_cafe.png" alt="Cafe" width={30} height={30} className="object-contain" />
                </a>
            </div>
            <div className="flex items-center ml-5 text-white">
                <a href="/view/about.html?year=2023" className="mx-2.5 text-white no-underline">2023</a>
                <a href="/view/about.html?year=2024" className="mx-2.5 text-white no-underline">2024</a>
                <a href="/view/about.html?year=2025" className="mx-2.5 text-white no-underline">2025</a>
            </div>
        </div>
    </div>
    </div>
  );
};

export default AboutPage;
