"use client";

import React, { useState } from "react";
import Logo from "@/app/components/Logo";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        setTimeout(() => onSilentRefresh(access_token), JWT_EXPIRY_TIME - 60000);
        router.push("/");
      }
    } catch {
      alert("로그인 도중에 문제가 생겼습니다.");
    }
  };

  // 토큰 갱신
  const onSilentRefresh = async (accessToken: string) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/auth/refresh`,
        { accessToken: accessToken },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        },
      );

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        setTimeout(() => onSilentRefresh(access_token), JWT_EXPIRY_TIME - 60000);
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
    <div className="w-[1707px] h-[905px] bg-white flex flex-col items-center">
      <div className="absolute top-8 left-12">
        <Logo />
      </div>

      <div className="absolute top-12 left-[1550px]">
        <button
          className="bg-[#1570EF] w-[67px] h-[27px] rounded-[5px] text-white font-[pretendard] text-[14px]"
          onClick={GoSignup}
        >
          회원가입
        </button>
      </div>

      <div className="relative top-[183px] flex flex-col items-center gap-[42px]">
        <p className="font-[pretendard] text-[44px] font-bold">
          자기개발을 다시하려고 하시나요?
        </p>

        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-[11px]">
            <p className="font-[pretendard] text-base font-medium">이메일</p>
            <input
              className="bg-[#F2F4F7] w-[545px] h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="이메일을 입력해주세요"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div className="flex flex-col gap-[11px]">
            <p className="font-[pretendard] text-base font-medium">비밀번호</p>
            <input
              className="bg-[#F2F4F7] w-[545px] h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="비밀번호을 입력해주세요"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePwChange}
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[260px] right-8 "
            >
              {showPassword ? (
                <AiFillEyeInvisible color="#1570EF" size={24} />
              ) : (
                <AiFillEye color="#1570EF" size={24} />
              )}
            </div>
          </div>

          <div>
            <button
              className="bg-[#1570EF] w-[80px] h-[40px] top-[330px] absolute right-4 font-[pretendard] text-white rounded-lg"
              onClick={handleSubmit}
            >
              확인
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-row gap-3 absolute top-[605px] items-center">
        <line className="bg-[#CECED2] w-[260px] h-[1px]" />
        <p className="text-[#CECED2] font-[pretendard]">or</p>
        <line className="bg-[#CECED2] w-[260px] h-[1px]" />
      </div>

      <div className="flex flex-col absolute top-[686px] gap-3">
        <div>
          <img src="Kakao.svg" className="absolute top-[16px] left-6" />
          <button
            onClick={handleSocialKakao}
            className="w-[180px] h-[50px] bg-[#FEE500] rounded-md font-[pretendard] pl-6"
          >
            카카오 로그인
          </button>
        </div>
        <div>
          <img src="Naver.svg" className="absolute top-[78.5px] left-6" />
          <button
            onClick={handleSocialNaver}
            className="w-[180px] h-[50px] bg-[#03C75A] rounded-md font-[pretendard] text-white pl-6"
          >
            네이버 로그인
          </button>
        </div>
        <div>
          <img src="Google.svg" className="absolute top-[136px] left-5" />
          <button
            onClick={handleSocialGoogle}
            className="w-[180px] h-[50px] bg-white border rounded-md font-[pretendard] pl-6"
          >
            구글로 로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;
