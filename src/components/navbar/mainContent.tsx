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
import { HeartIcon } from "@heroicons/react/24/outline";

import { updateMetadata } from "~/utils/helperFunctions";
import MessageIcon from "./messageIcon";
import NotificationIcon from "./notificationIcon";

const MainContent = () => {
  const { user, isLoaded } = useUser();

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

  let specificContent;

  if (!isLoaded) {
    specificContent = null;
  }

  const iconGroup = (
    <>
      <li>
        <NotificationIcon />
      </li>
      <li>
        <MessageIcon />
      </li>
      <li>
        <HeartIcon className="h-7 w-7 text-muted-foreground" />
      </li>
    </>
  );

  if (user?.unsafeMetadata.active === ActiveType.INVESTOR) {
    specificContent = (
      <>
        <li className="grow">
          <SearchBar />
        </li>
        <li>
          <Link href="/investor/jobs" passHref>
            <p className="text-white">My Jobs</p>
          </Link>
        </li>
        <li>
          <Link href="/applications" passHref>
            <p className="text-white">My Applications</p>
          </Link>
        </li>
        <li>
          <Link href="/investor" passHref>
            <p className="text-white">Profile</p>
          </Link>
        </li>
        {iconGroup}
      </>
    );
  } else if (user?.unsafeMetadata.active === ActiveType.FOUNDER) {
    specificContent = (
      <>
        <li>
          <Link href="/investments/create" passHref>
            <p className="text-muted-foreground">Create Venture</p>
          </Link>
        </li>
        <li>
          <Link href="/founder/investments" passHref>
            <p className="text-muted-foreground">Your Ventures</p>
          </Link>
        </li>
        {iconGroup}
      </>
    );
  } else if (user) {
    specificContent = (
      <>
        <li>
          {user?.unsafeMetadata.investor ? (
            <Link href="/investor" passHref onClick={() => setInvestorActive()}>
              <p className="text-white">Login as Investor</p>
            </Link>
          ) : (
            <Link href="/investor/create" passHref>
              <p className="text-white">Become an Investor</p>
            </Link>
          )}
        </li>
        <li>
          {user?.unsafeMetadata.founder ? (
            <Link href="/founder" passHref onClick={() => setFounderActive()}>
              <p className="text-white">Login as Founder</p>
            </Link>
          ) : (
            <Link href="/founder/create" passHref>
              <p className="text-white">Become a Founder</p>
            </Link>
          )}
        </li>
      </>
    );
  }

  return (
    <ul className="flex max-w-5xl grow items-center justify-end space-x-6">
      {specificContent}

      <SignedIn>
        <li>
          <UserButton afterSignOutUrl="/" />
        </li>
      </SignedIn>
      <SignedOut>
        <li>
          <SignInButton />
        </li>
        <li>
          {" "}
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
  );
};

export default MainContent;
