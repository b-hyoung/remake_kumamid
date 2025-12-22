import React from 'react';

/**
 * 이 컴포넌트는 Tailwind CSS를 사용한 텍스트 와이프(wipe) 호버 애니메이션 예시입니다.
 *
 * 작동 방식:
 * 1. 텍스트 색상을 투명하게 만듭니다 (`text-transparent`).
 * 2. 배경을 적용하고 텍스트 모양에 맞게 클리핑합니다 (`bg-clip-text`).
 * 3. 배경은 요소 너비의 200%를 차지하는 선형 그라데이션입니다.
 *    - 왼쪽 절반은 호버 색상 (`red-500`)입니다.
 *    - 오른쪽 절반은 기본 색상 (`#303030`)입니다.
 * 4. 초기 상태에서는 배경이 텍스트 오른쪽 절반만 보이도록 위치합니다 (`bg-[position:100%]`).
 * 5. 호버 시, 배경 위치가 `0%`로 전환되어 그라데이션이 오른쪽으로 슬라이드하며 왼쪽(호버 색상) 절반을 드러냅니다.
 * 6. `transition-background-position`은 이 위치 변경이 애니메이션으로 부드럽게 전환되도록 합니다.
 */
export default function TextWipeHoverExample() {
  const textWipeClass = "font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 from-50% to-[#303030] to-50% bg-[length:200%_100%] bg-[position:100%] hover:bg-[position:0%] transition-background-position duration-500 ease-in-out";

  return (
    <div className="flex items-center justify-center p-20 bg-gray-100">
      <a
        href="#"
        className={`${textWipeClass} text-4xl`}
      >
        여기에 마우스를 올리세요
      </a>
    </div>
  );
}