import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import HamburgerMenu from "./hamburgerMenu";
import Image from "next/image";
import MainContent from "./mainContent";

const Navbar = () => {
  const { user, isLoaded } = useUser();

  const [isBigScreen, setIsBigScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsBigScreen(window.innerWidth >= 640);
    };

    window.addEventListener("resize", checkScreenSize);

    checkScreenSize();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  return (
    <nav className="bg-black-500 border-b-2 border-border px-6 py-3">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" className="pr-8" passHref>
          <Image
            src="/logo.png"
            alt="logo"
            width={150}
            height={150}
            priority
            className="h-auto w-auto"
          />
        </Link>

        {isBigScreen ? <MainContent /> : <HamburgerMenu />}
      </div>
    </nav>
  );
};

export default Navbar;
