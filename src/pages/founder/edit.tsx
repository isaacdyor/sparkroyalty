import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next/types";
import { helpers } from "~/server/helpers/ssgHelper";
import { getAuth } from "@clerk/nextjs/server";
import Link from "next/link";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import { useUser } from "@clerk/nextjs";
import CountryInput from "~/components/profile/countryInput";
import router from "next/router";
import { capitalizeFirstLetter } from "~/utils/helperFunctions";
import TextArea from "~/components/shared/textArea";

const EditFounderPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { user, isLoaded } = useUser();
  const ctx = api.useContext();

  const { data, isLoading, error } = api.founders.getOne.useQuery({
    founderId: userId,
  });

  const { mutate: updateFounder } = api.founders.update.useMutation({
    onSuccess: async () => {
      void ctx.founders.getCurrent.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating founder profile:", errorMessage);
    },
  });

  const { mutate: updateName } = api.users.updateName.useMutation({
    onSuccess: async () => {
      console.log(user?.fullName);
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      console.error("Error updating founder profile:", errorMessage);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      e.preventDefault();
      updateFounder({
        fullName: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
          lastName
        )}`,
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        bio,
        country,
        educationAndExperience,
      });
      updateName({ firstName, lastName });

      await router.push("/founder");
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleSubmitVoid = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit(e).catch((err) => {
      console.error("Error updating metadata", err);
    });
  };

  const [firstName, setFirstName] = useState(data?.firstName ?? "");
  const [lastName, setLastName] = useState(data?.lastName ?? "");
  const [bio, setBio] = useState(data?.bio ?? "");
  const [country, setCountry] = useState(data?.country ?? "");
  const [educationAndExperience, setEducationAndExperience] = useState(
    data?.educationAndExperience ?? ""
  );
  useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
  }, [isLoaded, user?.firstName, user?.lastName]);

  if (isLoading ?? !isLoaded) return <Loading />;

  if (error ?? !user) return <Unauthorized />;

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Link href="/founder/create">Create a founder profile here</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-grow items-center justify-center  p-4">
      <div className="w-full max-w-xl rounded border border-slate-600 p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">
          Update Founder Profile
        </h1>
        <form onSubmit={handleSubmitVoid}>
          <div className="mb-4 flex">
            <div className="mr-4 w-full">
              <label className="mb-2 block text-white">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input w-full rounded bg-input px-4 py-2 text-white"
                required
              />
            </div>
            <div className="w-full">
              <label className="mb-2 block text-white">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input w-full rounded bg-input px-4 py-2 text-white"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-white">Bio</label>
            <TextArea
              text={bio}
              setText={setBio}
              placeHolder="Describe yourself..."
            />
          </div>
          <CountryInput country={country} setCountry={setCountry} />
          <div className="mb-4">
            <label className="mb-2 block text-white">
              Education and Experience
            </label>
            <TextArea
              text={educationAndExperience}
              setText={setEducationAndExperience}
              placeHolder="Describe your education and experience..."
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }

  await helpers.founders.getOne.prefetch({ founderId: userId });

  return {
    props: {
      userId,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default EditFounderPage;
