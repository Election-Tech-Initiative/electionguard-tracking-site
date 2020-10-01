import React from 'react';
import { Candidate, ContestDescription, InternationalizedText, PlaintextTallyContest } from '../electionguard/models';
import ContestChart, { ContestChartProps, CandidateChartData } from './ContestChart';

const ENGLISH: string = 'en';

const english = (intltext?: InternationalizedText) => {
    if (!intltext) return '';
    return intltext.text.filter((value) => value.language === ENGLISH)[0].value;
};

export interface ContestProps {
    contest: PlaintextTallyContest;
    description: ContestDescription;
    candidates: Candidate[];
}

/**
 * Render the results of a given Contest.
 *
 * NOTE: This is a container around the purely-presentational ContestChart component.
 * It resolves the election data structures into simplified chart-specific data.
 *
 * TODO: Reconsider this approach when higher-level state is added
 */
const Contest: React.FunctionComponent<ContestProps> = ({ contest, description, candidates }) => {
    const chartProps = getContestChartProps(contest, description, candidates);

    return <ContestChart {...chartProps} />;
};

/**
 * Transform the raw election data into props fit to inject into the contest chart.
 */
function getContestChartProps(
    contest: PlaintextTallyContest,
    description: ContestDescription,
    candidates: Candidate[]
): ContestChartProps {
    const getCandidateName = (candidateId: string) => {
        const candidate = candidates.find((c) => c.object_id === candidateId);
        return candidate ? english(candidate.ballot_name) : candidateId;
    };

    const candidateData: CandidateChartData[] = Object.entries(contest.selections).map(([candidateId, candidate]) => ({
        id: candidateId,
        title: getCandidateName(candidate.object_id),
        tally: candidate.tally,
    }));

    return {
        title: english(description.ballot_title),
        candidates: candidateData,
    };
}

export default Contest;
