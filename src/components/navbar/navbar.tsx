import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import HamburgerMenu from "./hamburgerMenu";
import Image from "next/image";
import MainContent from "./mainContent";
import { ActiveType } from "~/types/types";
import SearchBar from "./searchBar";

const Navbar = () => {
  const { user, isLoaded } = useUser();

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const checkScreenSize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", checkScreenSize);

    checkScreenSize();

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const showMainContent =
    (user?.unsafeMetadata.active == ActiveType.FOUNDER && width >= 690) ||
    (user?.unsafeMetadata.active == ActiveType.INVESTOR && width >= 600) ||
    (user?.unsafeMetadata.active == ActiveType.NONE && width >= 615) ||
    (!user && width >= 450);

  return (
    <nav className="bg-black-500 border-b border-border px-6 py-3">
      <div className="mx-auto flex items-center justify-between">
        <Link href="/" className="flex-1 pr-8" passHref>
          <Image
            src="/logo.png"
            alt="logo"
            width={150}
            height={150}
            priority
            className="h-auto w-auto min-w-[192px] shrink-0 "
          />
        </Link>

        {showMainContent ? <MainContent width={width} /> : <HamburgerMenu />}
      </div>
    </nav>
  );
};

export default Navbar;
