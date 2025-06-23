"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { usePasswordModalStore } from "../store/usePassword";

export function PasswordChangeModal() {
  const { open, closeModal } = usePasswordModalStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePasswordChange = async () => {
    setLoading(true);
    setMessage("");

    const dto = {
      currentPassword,
      newPassword,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/api/changePassword`,
        dto,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "69420",
          },
        },
      );

      if (response.status === 200) {
        setMessage("비밀번호가 성공적으로 변경되었습니다.");
        setTimeout(() => {
          closeModal();
          setCurrentPassword("");
          setNewPassword("");
        }, 1000);
      } else {
        setMessage("비밀번호 변경 실패. 다시 시도해주세요.");
      }
    } catch (error: any) {
      setMessage(error?.response?.data?.message || "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">현재 비밀번호</Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력하세요"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">새 비밀번호</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="새 비밀번호를 입력하세요"
            />
          </div>

          {message && <p className="text-sm text-red-500">{message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={handlePasswordChange} disabled={loading}>
            {loading ? "변경 중..." : "비밀번호 변경"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
