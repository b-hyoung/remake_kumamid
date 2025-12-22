"use client"; // new Date()를 사용하고, 클라이언트 측에서 렌더링되므로 use client 추가

export default function Footer() { // 함수 이름을 소문자 'footer'에서 대문자 'Footer'로 변경 (React 컨벤션)

  return (
    // 'absolute' 클래스를 제거하고, 상하 패딩(py)을 추가하여 일반적인 문서 흐름에 따르도록 수정
    <footer className="w-full text-center py-8 text-sm text-gray-500">
      © {new Date().getFullYear()}. DESIGNTHEHAM Co. all rights reserved.
    </footer>
  );
}
