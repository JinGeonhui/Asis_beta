"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

let tokenRequested = false; // 요청 중복 방지용 변수

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (!code) {
      alert("code 없음");
      router.push("/Signin");
      return;
    }

    if (tokenRequested) return; // 중복 요청 방지
    tokenRequested = true;

    const fetchToken = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/auth/token`,
          {
            code,
          },
        );

        localStorage.setItem("access_token", res.data.accessToken);
        router.push("/");
      } catch (err) {
        console.error("로그인 실패:", err);
        alert("소셜 로그인 실패");
        router.push("/Signin");
      }
    };

    fetchToken();
  }, [router]);

  return null;
}
