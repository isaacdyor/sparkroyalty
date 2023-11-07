import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import SwitchProfileButton from "./switchProfile";
import { useClerk } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import Link from "next/link";

const ProfileButton = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

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
        className="h-8 w-8 grow rounded-full object-cover hover:cursor-pointer"
        alt={`profile picture`}
        width={120}
        height={120}
        onClick={() => {
          setIsModalOpen(!isModalOpen);
        }}
      />
      {isModalOpen && (
        <div className="absolute right-5 top-[59px] z-50 flex w-64 flex-col rounded-lg bg-secondary bg-opacity-80 p-4">
          <div className=" flex">
            <Image
              src={user.imageUrl}
              className="mr-4 h-14 w-14 rounded-full object-cover"
              alt={`profile picture`}
              width={120}
              height={120}
            />
            <div className="flex flex-col">
              <p className="text-xl">{user?.fullName}</p>
              <p className="text-md text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <div className="py-4">
            <SwitchProfileButton setIsModalOpen={setIsModalOpen} />
          </div>
          <hr className="my-2 border-t-2 border-slate-600" />
          <p className="py-2 text-lg text-muted-foreground">
            <Link
              onClick={() => setIsModalOpen(false)}
              className="hover:text-muted-foreground/70"
              href="/profile"
            >
              Profile
            </Link>
          </p>
          <p className="py-2 text-lg text-muted-foreground">
            <Link
              onClick={() => setIsModalOpen(false)}
              className="hover:text-muted-foreground/70"
              href="/settings"
            >
              Settings
            </Link>
          </p>

          <div className="py-2 text-lg text-muted-foreground">
            <button
              className="hover:text-muted-foreground/70"
              onClick={() =>
                signOut(() => {
                  setIsModalOpen(false);
                  router.push("/");
                })
              }
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileButton;
