"use client";

import React, { useState } from "react";
import { Logo } from "@/app/components";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ICON } from "@/app/constants";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useUserStore } from "@/app/store/userStore";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();

  const router = useRouter();
  const JWT_EXPIRY_TIME = 24 * 3600 * 1000;

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const dto = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/auth/login`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": 69420,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const userData = response.data; // 서버에서 받은 유저 정보
        setUser(userData);

        router.push("/");
      }
    } catch {
      alert("로그인 도중에 문제가 생겼습니다.");
    }
  };

  // 토큰 갱신
  const onSilentRefresh = async (access_token: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/auth/refresh`,
        { access_token: access_token },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        setTimeout(onSilentRefresh, JWT_EXPIRY_TIME - 60000);
      }
    } catch (error: any) {
      console.error("refresh 토큰 에러", error);
    }
  };

  const handleSocialGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/oauth2/authorize/google`;
  };

  const handleSocialNaver = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/oauth2/authorize/naver`;
  };

  const handleSocialKakao = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/oauth2/authorize/kakao`;
  };

  const GoSignup = () => {
    router.push("/Signup");
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center relative">
      {/* 로고 */}
      <div className="absolute top-[2rem] left-[3.5rem]">
        <Logo />
      </div>

      {/* 회원가입 버튼 */}
      <div className="absolute top-[3rem] right-[3.5rem]">
        <button
          className="bg-[#1570EF] w-[67px] h-[27px] rounded-[5px] text-white font-[pretendard] text-[14px]"
          onClick={GoSignup}
        >
          회원가입
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col items-center justify-center h-full w-full">
        <p className="font-[pretendard] text-[44px] font-bold mt-[2.5rem] mb-10 text-center">
          자기개발을 다시하려고 하시나요?
        </p>

        {/* 로그인 폼 */}
        <div className="flex flex-col gap-[18px] w-full max-w-[545px] items-center">
          {/* 이메일 */}
          <div className="flex flex-col gap-[11px] w-full">
            <p className="font-[pretendard] text-base font-medium">이메일</p>
            <input
              className="bg-[#F2F4F7] w-full h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="이메일을 입력해주세요"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-[11px] w-full relative">
            <p className="font-[pretendard] text-base font-medium">비밀번호</p>
            <input
              className="bg-[#F2F4F7] w-full h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="비밀번호을 입력해주세요"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePwChange}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[45px] right-4 cursor-pointer"
            >
              {showPassword ? (
                <AiFillEyeInvisible color="#1570EF" size={24} />
              ) : (
                <AiFillEye color="#1570EF" size={24} />
              )}
            </div>
          </div>

          {/* 확인 버튼 */}
          <div className="w-full flex justify-end">
            <button
              className="bg-[#1570EF] w-[80px] h-[40px] font-[pretendard] text-white rounded-lg mt-[2rem]"
              onClick={handleSubmit}
            >
              확인
            </button>
          </div>
        </div>

        {/* 구분선 + or */}
        <div className="flex flex-row items-center w-full max-w-[545px] gap-3 my-8">
          <div className="bg-[#CECED2] h-[1px] flex-1" />
          <p className="text-[#CECED2] font-[pretendard]">or</p>
          <div className="bg-[#CECED2] h-[1px] flex-1" />
        </div>

        {/* 소셜 로그인 버튼 */}
        <div className="flex flex-col gap-3 w-full max-w-[545px] items-center">
          <button
            onClick={handleSocialKakao}
            className="w-[180px] h-[50px] bg-[#FEE500] rounded-md font-[pretendard] flex items-center pl-6 relative"
          >
            <img
              src={`${ICON.SVG_ICON}/Kakao.svg`}
              className="w-6 h-6 absolute left-6"
              alt="카카오"
            />
            <span className="mx-auto">카카오 로그인</span>
          </button>
          <button
            onClick={handleSocialNaver}
            className="w-[180px] h-[50px] bg-[#03C75A] rounded-md font-[pretendard] text-white flex items-center pl-6 relative"
          >
            <img
              src={`${ICON.SVG_ICON}/Naver.svg`}
              className="w-6 h-6 absolute left-6"
              alt="네이버"
            />
            <span className="mx-auto">네이버 로그인</span>
          </button>
          <button
            onClick={handleSocialGoogle}
            className="w-[180px] h-[50px] bg-white border rounded-md font-[pretendard] flex items-center pl-6 relative"
          >
            <img
              src={`${ICON.SVG_ICON}/Google.svg`}
              className="w-6 h-6 absolute left-6"
              alt="구글"
            />
            <span className="mx-auto">구글로 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
