import { useState } from "react";
import { api } from "~/utils/api";
import type { GetServerSideProps, NextPage } from "next/types";
import router from "next/router";
import { getAuth } from "@clerk/nextjs/server";
import { helpers } from "~/server/helpers/ssgHelper";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Loading from "~/components/conditionals/loading";
import Unauthorized from "~/components/conditionals/unauthorized";
import InvestorSkill from "~/components/profile/investorSkill";
import type { ExperienceLevelType } from "@prisma/client";
import { ActiveType } from "~/types/types";
import CountryInput from "~/components/profile/countryInput";
import MoreInfo from "~/components/shared/moreInfo";
import { capitalizeFirstLetter } from "~/utils/helperFunctions";
import TextArea from "~/components/shared/textArea";

interface Skill {
  skill: string;
  experience: ExperienceLevelType | "";
}

interface SkillInput {
  skill: string;
  experience: ExperienceLevelType;
}

const EditInvestorPage: NextPage<{ userId: string }> = ({ userId }) => {
  const { user } = useUser();
  const ctx = api.useContext();

  const { data, isLoading } = api.investors.getOne.useQuery({
    investorId: userId,
  });

  const { mutate } = api.investors.update.useMutation({
    onSuccess: async () => {
      void ctx.investors.getCurrent.invalidate();
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
    const typedSkills = skills as SkillInput[];
    try {
      mutate({
        fullName: `${capitalizeFirstLetter(firstName)} ${capitalizeFirstLetter(
          lastName
        )}`,
        firstName: capitalizeFirstLetter(firstName),
        lastName: capitalizeFirstLetter(lastName),
        title,
        bio,
        skills: typedSkills,
        country,
        educationAndExperience,
      });

      updateName({ firstName, lastName });

      await router.push("/investor");
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
  const [title, setTitle] = useState(data?.title ?? "");
  const [bio, setBio] = useState(data?.bio ?? "");
  const [skills, setSkills] = useState<Skill[]>(data?.skills ?? []);
  const [country, setCountry] = useState(data?.country ?? "");
  const [educationAndExperience, setEducationAndExperience] = useState(
    data?.educationAndExperience ?? ""
  );
  if (isLoading) return <Loading />;

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Link href="/founder/create">Create an investor profile here</Link>
      </div>
    );
  }

  console.log(user?.unsafeMetadata.active);

  if (user?.unsafeMetadata.active !== ActiveType.INVESTOR)
    return <Unauthorized />;

  return (
    <div className="flex flex-grow items-center justify-center bg-black p-4">
      <div className="w-full max-w-xl rounded border border-slate-600 bg-black p-6">
        <h1 className="mb-4 text-2xl font-semibold text-white">
          Update Investor Profile
        </h1>
        <form onSubmit={handleSubmitVoid}>
          <div className="mb-4 flex items-center">
            <div className="mr-4 w-full">
              <label className="mb-2 block text-white">First Name</label>

              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input w-full rounded px-4 py-2 text-black"
                required
              />
            </div>
            <div className="w-full">
              <label className="mb-2 block text-white">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input w-full rounded px-4 py-2 text-black"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <MoreInfo
              infoText="The kind of work you provide. For example: web developer."
              label="Occupation Title"
            />

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input w-full rounded px-4 py-2 text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-white">Bio</label>
            <TextArea
              text={bio}
              setText={setBio}
              placeHolder="Describe yourself..."
            />
          </div>
          <InvestorSkill skills={skills} setSkills={setSkills} />
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

  await helpers.investors.getOne.prefetch({ investorId: userId });

  return {
    props: {
      userId,
      trpcState: helpers.dehydrate(),
    },
  };
};

export default EditInvestorPage;
