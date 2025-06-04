import React, { useState } from "react";
import Logo from "../components/Logo";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

function Signup() {
  const [userName, setUserName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRe, setPasswordRe] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRe, setShowPasswordRe] = useState(false);

  const router = useRouter();

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUserName(e.target.value);
  }

  function handleAgeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAge(e.target.value);
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value);
  }

  function handlePwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }

  function handlePwReChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordRe(e.target.value);
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const dto = {
      name: userName,
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/auth/register`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        },
      );
      router.push("/");

      if (password !== passwordRe) {
        alert("비밀번호가 일치하지 않습니다.");
      }
    } catch {
      alert("회원가입 도중 문제가 생겼습니다.");
    }
  };

  const GoSignin = () => {
    router.push("/Signin");
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center">
      <div className="absolute top-[2rem] left-[3.5rem]">
        <Logo />
      </div>

      <div className="absolute top-[3rem] right-[3.5rem]">
        <button
          className="bg-[#1570EF] w-[67px] h-[27px] rounded-[5px] text-white font-[pretendard] text-[14px]"
          onClick={GoSignin}
        >
          로그인
        </button>
      </div>

      <div className="relative top-[14%] flex flex-col items-center gap-[12px]">
        <p className="font-[pretendard] text-[44px] font-bold">
          자기개발을 시작하려고 하시나요?
        </p>

        <div className="flex flex-col gap-[18px]">
          <div className="flex flex-col gap-[11px]">
            <p className="font-[pretendard] text-base font-medium">이름</p>
            <input
              className="bg-[#F2F4F7] w-[545px] h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="이름을 입력해주세요"
              type="text"
              value={userName}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="flex flex-col gap-[11px]">
            <p className="font-[pretendard] text-base font-medium">나이</p>
            <input
              className="bg-[#F2F4F7] w-[545px] h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="나이를 입력해주세요"
              type="text"
              value={age}
              onChange={handleAgeChange}
              required
            />
          </div>
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
              placeholder="비밀번호를 입력해주세요"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePwChange}
              required
              maxLength={8}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-[73.5%] right-8 "
            >
              {showPassword ? (
                <AiFillEyeInvisible color="#1570EF" size={24} />
              ) : (
                <AiFillEye color="#1570EF" size={24} />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[11px]">
            <p className="font-[pretendard] text-base font-medium">
              비밀번호 확인
            </p>
            <input
              className="bg-[#F2F4F7] w-[545px] h-[50px] rounded-lg placeholder:text-[#95979D] pl-4 focus:outline-none"
              placeholder="비밀번호를 확인해주세요"
              type={showPasswordRe ? "text" : "password"}
              value={passwordRe}
              onChange={handlePwReChange}
              required
              maxLength={8}
            />
            <div
              onClick={() => setShowPasswordRe(!showPasswordRe)}
              className="absolute top-[90.8%] right-8 "
            >
              {showPasswordRe ? (
                <AiFillEyeInvisible color="#1570EF" size={24} />
              ) : (
                <AiFillEye color="#1570EF" size={24} />
              )}
            </div>
          </div>

          <div>
            <button
              className="bg-[#1570EF] w-[80px] h-[40px] absolute right-4 font-[pretendard] text-white rounded-lg mt-6"
              onClick={handleSubmit}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
