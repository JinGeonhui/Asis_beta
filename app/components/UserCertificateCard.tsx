'use client'

import React, { useState, useEffect } from "react";
import CertificateCard from "./CertificateCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

function UserCertificateCard() {
  const [certificates, setCertificates] = useState([
    { name: "정보처리기능사", date: "2023.05", org: "한국산업인력공단" },
    { name: "리눅스 마스터", date: "2024.03", org: "한국정보통신진흥협회" },
    { name: "컴퓨터활용능력 2급", date: "2022.11", org: "대한상공회의소" },
  ]);

  const [dDay, setDDay] = useState<number | null>(null);

  const [newCert, setNewCert] = useState({
    name: "",
    date: "",
    org: "",
  });

  useEffect(() => {
    const testDate = new Date("2025-07-15");
    const today = new Date();
    const diffTime = testDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setDDay(diffDays);
  }, []);

  const handleAddCertificate = () => {
    if (newCert.name && newCert.date && newCert.org) {
      setCertificates((prev) => [...prev, newCert]);
      setNewCert({ name: "", date: "", org: "" });
    }
  };

  return (
    <div className="w-[95%] bg-white mt-5 rounded-xl p-6 flex flex-col justify-between min-h-[200px] shadow-md font-[pretendard] gap-[1rem]">
      <div className="flex justify-between items-center">
        <p className="font-bold text-2xl">보유 자격증</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>자격증 추가하기</Button>
          </DialogTrigger>
          <DialogContent className="flex flex-col gap-4">
            <p className="font-semibold text-lg">자격증 추가</p>
            <Input
              placeholder="자격증명"
              value={newCert.name}
              onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
            />
            <Input
              placeholder="취득일 (예: 2025.01)"
              value={newCert.date}
              onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
            />
            <Input
              placeholder="발급기관"
              value={newCert.org}
              onChange={(e) => setNewCert({ ...newCert, org: e.target.value })}
            />
            <Button onClick={handleAddCertificate}>추가</Button>
          </DialogContent>
        </Dialog>
      </div>

      {dDay !== null && (
        <p className="text-sm text-gray-500">다음 웹디자인기능사 시험까지 D-{dDay}</p>
      )}

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 whitespace-nowrap">
          {certificates.map((cert, idx) => (
            <CertificateCard key={idx} name={cert.name} date={cert.date} org={cert.org} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default UserCertificateCard;
