import Link from "next/link";
import {
  SignInButton,
  useUser,
  UserButton,
  SignedIn,
  SignedOut,
  SignUpButton,
} from "@clerk/nextjs";
import { ActiveType } from "~/types/types";
import SearchBar from "./searchBar";
import { HeartIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import { updateMetadata } from "~/utils/helperFunctions";
import MessageIcon from "./messageIcon";
import NotificationIcon from "./notificationIcon";
import { useEffect, useRef, useState } from "react";
import ProfileButton from "./profileButton";

const MainContent: React.FC<{ width: number }> = ({ width }) => {
  const { user, isLoaded } = useUser();

  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [showSearchBar, setShowSearchBar] = useState(false);

  const setFounderActive = () => {
    const unsafeMetadata = {
      investor: user!.unsafeMetadata.investor,
      founder: true,
      active: ActiveType.FOUNDER,
    };
    updateMetadata(user!, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const setInvestorActive = () => {
    const unsafeMetadata = {
      investor: true,
      founder: user!.unsafeMetadata.founder,
      active: ActiveType.INVESTOR,
    };
    updateMetadata(user!, unsafeMetadata).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const founderContent = (
    <>
      <li>
        <Link href="/investments/create" passHref>
          <p className="whitespace-nowrap text-muted-foreground">
            Create Venture
          </p>
        </Link>
      </li>
      <li>
        <Link href="/founder/investments" passHref>
          <p className="whitespace-nowrap text-muted-foreground">
            Your Ventures
          </p>
        </Link>
      </li>
    </>
  );

  const investorContent = (
    <>
      <li>
        <Link href="/investor/jobs" passHref>
          <p className="whitespace-nowrap text-muted-foreground">My Jobs</p>
        </Link>
      </li>
      {width <= 800 && (
        <li>
          <MagnifyingGlassIcon
            onClick={() => {
              setShowSearchBar(true);
            }}
            className="h-7 w-7 text-muted-foreground hover:cursor-pointer"
          />
        </li>
      )}
    </>
  );

  const iconGroup = (
    <div className="flex gap-4">
      <li>
        <NotificationIcon />
      </li>
      <li>
        <MessageIcon />
      </li>
      <li>
        <HeartIcon className="h-7 w-7 text-muted-foreground" />
      </li>
    </div>
  );

  const activeContent = (
    <>
      {(!showSearchBar || width > 800) && (
        <>
          {user?.unsafeMetadata.active == ActiveType.INVESTOR
            ? investorContent
            : founderContent}
          {iconGroup}
        </>
      )}
    </>
  );
  const inactiveContent = (
    <>
      <li>
        {user?.unsafeMetadata.investor ? (
          <Link href="/investor" passHref onClick={() => setInvestorActive()}>
            <p className="text-muted-foreground">Login as Investor</p>
          </Link>
        ) : (
          <Link href="/investor/create" passHref>
            <p className="text-muted-foreground">Become an Investor</p>
          </Link>
        )}
      </li>
      <li>
        {user?.unsafeMetadata.founder ? (
          <Link href="/founder" passHref onClick={() => setFounderActive()}>
            <p className="text-muted-foreground">Login as Founder</p>
          </Link>
        ) : (
          <Link href="/founder/create" passHref>
            <p className="text-muted-foreground">Become a Founder</p>
          </Link>
        )}
      </li>
    </>
  );
  const signedInContent = (
    <>
      {user?.unsafeMetadata.active == ActiveType.NONE
        ? inactiveContent
        : activeContent}
      <li>
        <ProfileButton />
      </li>
    </>
  );

  useEffect(() => {
    if (showSearchBar) {
      inputRef.current?.focus();
    }
  }, [showSearchBar]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef?.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchBar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef]);

  const renderSearchBar =
    showSearchBar ||
    (user?.unsafeMetadata.active == ActiveType.INVESTOR && width > 800);

  return (
    <>
      <ul className="flex max-w-5xl grow items-center justify-end space-x-5">
        {renderSearchBar && (
          <div className="w-full" ref={searchRef}>
            <SearchBar inputRef={inputRef} />
          </div>
        )}
        <SignedIn>{signedInContent}</SignedIn>
        <SignedOut>
          <li>
            <SignInButton />
          </li>
          <li>
            <SignUpButton
              redirectUrl="/"
              unsafeMetadata={{
                active: "none",
                investor: false,
                founder: false,
              }}
            />
          </li>
        </SignedOut>
      </ul>
    </>
  );
};

export default MainContent;
