import stringSimilarity from "string-similarity";
import type { InvestmentType, InvestorType } from "~/types/types";

enum SortingMethod {
  Relevance = "relevance",
  Latest = "ratest",
  Payout = "payout",
}

export const investmentSort = (
  investments: InvestmentType[],
  search: string,
  sortingMethod: SortingMethod,
  page: number,
  userData?: InvestorType
): InvestmentType[] => {
  const sortedData = getOrderedData(
    investments,
    search,
    sortingMethod,
    userData
  );

  const startIndex = (page - 1) * 30;
  const endIndex = startIndex + 30;

  return sortedData.slice(startIndex, endIndex);
};

export const getLength = (
  investments: InvestmentType[],
  search: string
): number => {
  let filteredData: InvestmentType[];
  if (search) {
    filteredData = filterData(investments, search);
  } else {
    filteredData = investments;
  }

  return filteredData.length;
};

const getOrderedData = (
  investments: InvestmentType[],
  search: string,
  sortingMethod: SortingMethod,
  userData?: InvestorType
): InvestmentType[] => {
  let filteredData: InvestmentType[];
  if (search) {
    filteredData = filterData(investments, search);
  } else {
    filteredData = investments;
  }

  if (filteredData.length === 0) {
    return [];
  }

  let sortedData;
  if (sortingMethod == SortingMethod.Relevance) {
    sortedData = relavance(filteredData, search, userData);
  } else if (sortingMethod == SortingMethod.Latest) {
    sortedData = latest(filteredData);
  } else {
    sortedData = payout(filteredData);
  }

  return sortedData;
};

const filterData = (
  investments: InvestmentType[],
  search: string
): InvestmentType[] => {
  const filteredData = investments.filter((investment) => {
    const workType = investment.workType.toLowerCase();
    const title = investment.title.toLowerCase();
    const description = investment.description.toLowerCase();
    const skills = investment.skills?.map((skill) => skill.skill.toLowerCase());
    const extraDetails = investment.extraDetails.toLowerCase();

    const searchTerms = search.toLowerCase().split(" ");

    const workTypeMatch = searchTerms.some((term) => workType.includes(term));

    const titleMatch = searchTerms.some((term) => title.includes(term));
    const descriptionMatch = searchTerms.some((term) =>
      description.includes(term)
    );
    const skillsMatch = skills?.some((skill) =>
      searchTerms.some((term) => skill.includes(term))
    );
    const extraDetailsMatch = searchTerms.some((term) =>
      extraDetails.includes(term)
    );

    return (
      workTypeMatch ??
      titleMatch ??
      descriptionMatch ??
      skillsMatch ??
      extraDetailsMatch
    );
  });

  return filteredData;
};

const relavance = (
  investments: InvestmentType[],
  search: string,
  userData?: InvestorType
): InvestmentType[] => {
  const customSort = (
    a: { investment: InvestmentType; score: number },
    b: { investment: InvestmentType; score: number }
  ) => {
    const scoreDifference = b.score - a.score;

    if (Math.abs(scoreDifference) <= 0.1) {
      return sortBySkills(a.investment, b.investment);
    } else {
      return scoreDifference;
    }
  };

  const sortBySkills = (a: InvestmentType, b: InvestmentType) => {
    if (!userData) {
      return 0;
    } else {
      if (
        numOfMatchingElements(a.skills!.map((skill) => skill.skill)) >
        numOfMatchingElements(b.skills!.map((skill) => skill.skill))
      ) {
        return -1;
      } else if (
        numOfMatchingElements(a.skills!.map((skill) => skill.skill)) <
        numOfMatchingElements(b.skills!.map((skill) => skill.skill))
      ) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  const numOfMatchingElements = (arr: string[]) => {
    const userSkills = userData!.skills!.map((skill) => skill.skill);
    let matchingElements = 0;

    for (const skill of arr) {
      for (const userSkill of userSkills) {
        if (skill?.toLowerCase() === userSkill?.toLowerCase()) {
          matchingElements += 1;
        }
      }
    }

    return matchingElements;
  };

  if (!search) {
    const sortedBySkills = investments.sort(sortBySkills);
    return sortedBySkills;
  }

  const workTypes = investments.map((investment) => investment.workType);

  const similarityScores = stringSimilarity.findBestMatch(
    search.toLowerCase(),
    workTypes
  );

  const investmentsWithScores = investments.map((investment, index) => ({
    investment,
    score: similarityScores.ratings[index]!.rating,
  }));

  investmentsWithScores.sort(customSort);

  const sortedInvestments = investmentsWithScores.map(
    (pair) => pair.investment
  );

  return sortedInvestments;
};

const latest = (investments: InvestmentType[]): InvestmentType[] => {
  console.log(investments.map((investment) => investment.createdAt));
  const sortedInvestments = investments.sort((a, b) => {
    const aDate = new Date(a.createdAt);
    const bDate = new Date(b.createdAt);

    return bDate.getTime() - aDate.getTime();
  });

  return sortedInvestments;
};

const payout = (investments: InvestmentType[]): InvestmentType[] => {
  const sortedInvestments = investments.sort((a, b) => {
    const aPayout = a.totalPayout;
    const bPayout = b.totalPayout;

    return bPayout - aPayout;
  });

  return sortedInvestments;
};
