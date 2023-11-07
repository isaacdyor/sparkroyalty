import Link from "next/link";
import {
  SignInButton,
  useUser,
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
  const { user } = useUser();

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
      <div>
        <Link href="/investments/create" passHref>
          <p className="whitespace-nowrap text-muted-foreground hover:text-white">
            Create Venture
          </p>
        </Link>
      </div>
      <div>
        <Link href="/founder/investments" passHref>
          <p className="whitespace-nowrap text-muted-foreground hover:text-white">
            Your Ventures
          </p>
        </Link>
      </div>
    </>
  );

  const investorContent = (
    <>
      <div>
        <Link href="/investor/jobs" passHref>
          <p className="whitespace-nowrap text-muted-foreground hover:text-white">
            My Jobs
          </p>
        </Link>
      </div>
      {width <= 800 && (
        <div>
          <MagnifyingGlassIcon
            onClick={() => {
              setShowSearchBar(true);
            }}
            className="h-7 w-7 text-muted-foreground hover:cursor-pointer"
          />
        </div>
      )}
    </>
  );

  const iconGroup = (
    <div className="flex gap-2">
      <div className="rounded-xl p-1 hover:cursor-pointer hover:bg-slate-800">
        <NotificationIcon />
      </div>
      <div className="rounded-xl p-1 hover:cursor-pointer hover:bg-slate-800">
        <MessageIcon />
      </div>
      <div className="rounded-xl p-1 hover:cursor-pointer hover:bg-slate-800">
        <HeartIcon className="h-7 w-7 text-muted-foreground  hover:cursor-pointer" />
      </div>
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
      <div>
        {user?.unsafeMetadata.investor ? (
          <Link href="/profile" passHref onClick={() => setInvestorActive()}>
            <p className="text-muted-foreground hover:text-white">
              Login as Investor
            </p>
          </Link>
        ) : (
          <Link href="/investor/create" passHref>
            <p className="text-muted-foreground hover:text-white">
              Become an Investor
            </p>
          </Link>
        )}
      </div>
      <div>
        {user?.unsafeMetadata.founder ? (
          <Link href="/profile" passHref onClick={() => setFounderActive()}>
            <p className="text-muted-foreground hover:text-white">
              Login as Founder
            </p>
          </Link>
        ) : (
          <Link href="/founder/create" passHref>
            <p className="text-muted-foreground hover:text-white">
              Become a Founder
            </p>
          </Link>
        )}
      </div>
    </>
  );
  const signedInContent = (
    <>
      {user?.unsafeMetadata.active == ActiveType.NONE
        ? inactiveContent
        : activeContent}
      <div>
        <ProfileButton />
      </div>
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
      <div className="flex grow items-center justify-end space-x-4">
        {renderSearchBar && (
          <div className="flex w-full justify-center" ref={searchRef}>
            <SearchBar inputRef={inputRef} />
          </div>
        )}
        <div className="flex shrink-0 items-center gap-4 pl-1">
          <SignedIn>{signedInContent}</SignedIn>
        </div>

        <SignedOut>
          <div>
            <SignInButton />
          </div>
          <div>
            <SignUpButton
              redirectUrl="/"
              unsafeMetadata={{
                active: "none",
                investor: false,
                founder: false,
              }}
            />
          </div>
        </SignedOut>
      </div>
    </>
  );
};

export default MainContent;
