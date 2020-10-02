import React from 'react';
import { useLocalization } from '../localization/LocalizationProvider';
import { Candidate, ContestDescription, ContestResults as ContestResultsModel } from '../models';
import ContestChart, { CandidateChartData } from './ContestChart';

export interface ContestResultsProps {
    results: ContestResultsModel;
    contest: ContestDescription;
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
const ContestResults: React.FunctionComponent<ContestResultsProps> = ({ results, contest, candidates }) => {
    const { translate } = useLocalization();

    const getCandidateName = (selectionId: string) => {
        const candidateId =
            contest.ballot_selections.find((s) => s.object_id === selectionId)?.candidate_id || 'UNKNOWN';
        const candidate = candidates.find((c) => c.object_id === candidateId);
        return candidate ? translate(candidate.ballot_name) : candidateId;
    };

    const candidateData: CandidateChartData[] = Object.entries(results).map(([selectionId, tally]) => ({
        id: selectionId,
        title: getCandidateName(selectionId),
        tally: tally,
    }));

    return <ContestChart title={translate(contest.ballot_title)} candidates={candidateData} />;
};

export default ContestResults;
