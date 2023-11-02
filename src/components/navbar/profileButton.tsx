import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import user from "pusher-js/types/src/core/user";
import React, { useEffect, useState } from "react";
import { ActiveType } from "~/types/types";
import Image from "next/image";

const ProfileButton = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  // close the modal if we click outside of it
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [ref]);

  if (!user) return null;
  return (
    <div ref={ref}>
      <Image
        src={user.imageUrl}
        className="h-8 w-8 rounded-full object-cover"
        alt={`profile picture`}
        width={120}
        height={120}
        onClick={() => setIsModalOpen(true)}
      />
      {isModalOpen && <div className="absolute">Hello</div>}
    </div>
  );
};

export default ProfileButton;
