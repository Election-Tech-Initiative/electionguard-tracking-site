import React from 'react';
import { Text } from '@fluentui/react';
import { HorizontalBarChart } from '@uifabric/charting';
import { Candidate, ContestDescription, InternationalizedText, PlaintextTallyContest } from '../electionguard/models';

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

export const Contest: React.FunctionComponent<ContestProps> = ({ contest, description, candidates }) => (
    <>
        <Text variant="xLarge">{english(description.ballot_title)}</Text>
        {Object.keys(contest.selections)
            .map((key) => ({
                object_id: contest.selections[key].object_id,
                tally: contest.selections[key].tally,
                candidate_id: description.ballot_selections,
            }))
            .sort((a, b) => a.tally - b.tally)
            .map((selection) => (
                <HorizontalBarChart
                    data={[
                        {
                            chartTitle: selection.object_id,
                            chartData: [{ horizontalBarChartdata: { x: selection.tally, y: 5 }, color: '#1EA7FD' }],
                        },
                    ]}
                />
            ))}
    </>
);
