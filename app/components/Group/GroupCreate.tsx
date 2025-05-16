// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// import { SettingPage } from "../../templates/SettingPage";
// import { IconInput } from "../../components/IconInput";
// import { IconTextBox } from "../../components/IconTextBox";
// import { ChoosedBox } from "../../components/ChoosedBox";
// import { TdlBox } from "../../components/TdlBox";

// export function GroupCreate() {
//   const [userId, setUserId] = useState("");
//   const [friendData, setFriendData] = useState<
//     { friend: string; email: string; userCode: string }[]
//   >([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [selectedFriends, setSelectedFriends] = useState<
//     { friend: string; email: string; userCode: string }[]
//   >([]);
//   const [inputValue, setInputValue] = useState(""); // 입력값 상태
//   const [tdls, setTdls] = useState<string[]>([]); // 추가된 TDL 목록 상태
//   const [token, setToken] = useState<string | null>(null);

//   useEffect(() => {
//     const accessToken = localStorage.getItem("accessToken");
//     setToken(accessToken);
//   }, []);

//   const router = useRouter();

//   const email = "s23054@gsm.hs.kr";

//   const clientRef = useRef<Client | null>(null);
//   const debounceTimeout = useRef<NodeJS.Timeout>();

//   useEffect(() => {
//     const socket = new SockJS(
//       `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/ws`,
//     );
//     const client = new Client({
//       webSocketFactory: () => socket,
//       reconnectDelay: 5000,

//       onConnect: () => {
//         setIsConnected(true);

//         client.subscribe(`/topic/group/create/${email}`, (message) => {
//           try {
//             const response = JSON.parse(message.body);
//             if (Array.isArray(response)) {
//               const mappedData = response.map((item) => ({
//                 friend: item.name,
//                 email: item.email,
//                 userCode: item.userCode || "",
//               }));
//               setFriendData(mappedData);
//             } else if (response?.name && response?.email) {
//               setFriendData([
//                 {
//                   friend: response.name,
//                   email: response.email,
//                   userCode: response.userCode || "",
//                 },
//               ]);
//             } else {
//               setFriendData([]);
//             }
//           } catch (error) {
//             setFriendData([]);
//           }
//         });
//       },

//       onStompError: (frame) => {},
//       onWebSocketClose: (event) => {
//         setIsConnected(false);
//       },
//       onWebSocketError: (event) => {},
//     });

//     client.activate();
//     clientRef.current = client;

//     return () => {
//       client.deactivate();
//     };
//   }, []);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       if (userId.trim() !== "" && isConnected && clientRef.current) {
//         if (debounceTimeout.current) {
//           clearTimeout(debounceTimeout.current);
//         }

//         debounceTimeout.current = setTimeout(() => {
//           const payload = {
//             email: email,
//             friend: userId.trim(),
//           };

//           if (clientRef.current !== null) {
//             clientRef.current.publish({
//               destination: "/app/group/friends",
//               body: JSON.stringify(payload),
//               headers: { "content-type": "application/json" },
//             });
//           } else {
//           }
//         }, 300);
//       }
//     }
//   };

//   const handleEnterTDL = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && inputValue.trim() !== "") {
//       setTdls([...tdls, inputValue.trim()]); // TDL 추가
//       setInputValue(""); // 입력 필드 초기화
//     }
//   };

//   const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUserId(e.target.value);
//   };

//   const handleAddFriend = (friend: {
//     friend: string;
//     email: string;
//     userCode: string;
//   }) => {
//     const alreadyAdded = selectedFriends.some((f) => f.email === friend.email);
//     if (!alreadyAdded) {
//       setSelectedFriends((prev) => [...prev, friend]);
//     }
//   };

//   const handleRemoveFriend = (email: string) => {
//     setSelectedFriends(
//       (prevFriends) => prevFriends.filter((friend) => friend.email !== email), // 해당 친구 이메일로 필터링하여 삭제
//     );
//   };

//   const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
//     const payload = {
//       titles: tdls,
//       receivers: selectedFriends.map((friend) => friend.userCode),
//       category: "운동",
//     };

//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/group/toDoList/create`,
//         payload,
//         {
//           headers: {
//             "ngrok-skip-browser-warning": "69420",
//             Authorization: `Bearer ${token}`,
//           },
//           withCredentials: true,
//         },
//       );

//       if (response.status === 200) {
//         router.push("/");
//       }
//     } catch (error) {
//       console.error("단체 TDL 방 생성 실패", error);
//     }
//   };

//   return (
//     <SettingPage>
//       <div className="w-full h-screen flex flex-col items-center">
//         <div className="w-full flex-1 overflow-y-scroll overflow-x-hidden scrollbar-hide pb-[300px] flex flex-col items-center">
//           <div className="w-[703px] relative top-[150px] font-[pretendard] flex flex-col items-start">
//             <p className="font-bold text-[30px]">
//               단체 TDL을 함께할 친구를 초대해주세요
//             </p>

//             <div className="w-full flex flex-col gap-[22px] relative top-[31px]">
//               <div className="flex flex-col gap-[14px] w-full">
//                 <p className="font-medium">검색</p>
//                 <IconInput
//                   iconSrc="/Search.svg"
//                   iconPosition="right"
//                   placeholder="초대할 사람의 이름을 적고, Enter 키를 눌러주세요"
//                   value={userId}
//                   onChange={handleUserIdChange}
//                   onKeyDown={handleKeyDown}
//                 />
//               </div>

//               <div className="flex flex-col gap-[14px] w-full">
//                 <p className="font-medium">검색 결과</p>
//                 {friendData.length > 0 ? (
//                   friendData.map((friend, index) => (
//                     <IconTextBox
//                       key={`${friend.userCode}-${index}`}
//                       iconSrc="/Plus.svg"
//                       iconPosition="right"
//                       text={`${friend.friend} (${friend.email})`}
//                       iconAsButton={true}
//                       onIconClick={() => handleAddFriend(friend)}
//                     />
//                   ))
//                 ) : (
//                   <IconTextBox
//                     iconSrc="/Plus.svg"
//                     iconPosition="right"
//                     text="검색된 유저가 없습니다."
//                     iconAsButton={true}
//                   />
//                 )}
//               </div>

//               {selectedFriends.length > 0 && (
//                 <div className="flex flex-col gap-[14px] w-full">
//                   <p className="font-medium">현재 초대할 인원</p>
//                   <div className="flex flex-col gap-[13px]">
//                     {selectedFriends.map((friend, index) => (
//                       <ChoosedBox
//                         key={`${friend.email}-${index}`}
//                         iconSrc="/BlueX.svg"
//                         iconPosition="right"
//                         text={friend.friend}
//                         iconAsButton={true}
//                         onIconClick={() => handleRemoveFriend(friend.email)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="w-[703px] font-[pretendard] flex flex-col items-start relative top-[215px] gap-[14px]">
//             <p className="font-bold text-[30px]">
//               단체 TDL의 목표 TDL을 작성해주세요
//             </p>
//             <div className="w-full flex flex-col gap-[13px]">
//               <p className="font-medium">
//                 추가할 TDL을 작성하고 Enter키를 눌러주세요
//               </p>
//               <input
//                 className="w-full h-[56px] pl-4 py-2 rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#1570EF] bg-[#F2F4F7] placeholder:color-[#95979D]"
//                 placeholder="TDL을 적어주세요"
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyDown={handleEnterTDL}
//               />
//             </div>

//             {tdls.length > 0 && (
//               <div className="flex flex-col gap-[14px] w-full">
//                 <p className="font-medium">현재 추가된 TDL</p>
//                 <div className="flex flex-col gap-[13px]">
//                   {tdls.map((tdlItem, index) => (
//                     <TdlBox
//                       key={index}
//                       iconSrc="/BlueX.svg"
//                       iconPosition="right"
//                       text={tdlItem}
//                       iconAsButton={true}
//                       onIconClick={() => {
//                         setTdls((prev) =>
//                           prev.filter((item, i) => i !== index),
//                         );
//                       }}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="w-[703px] flex flex-col items-end relative top-[246px]">
//             <button
//               className="w-[100px] h-[41px] font-[pretendard] font-semibold text-[18px] bg-[#1570EF] text-white rounded-[8px]"
//               onClick={handleSubmit}
//             >
//               생성하기
//             </button>
//           </div>
//         </div>
//       </div>
//     </SettingPage>
//   );
// }
