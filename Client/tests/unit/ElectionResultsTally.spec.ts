import { mount } from '@vue/test-utils';

import ElectionResultsTally from '@/components/ElectionResultsTally.vue';
import { Tally } from '@/models/Tally';

jest.mock('@/components/ElectionResultsTallyBar.vue', () => ({ default: jest.fn() }));

describe('ElectionResultsTally.vue', () => {
    const getMountedWrapper = (tallies: Tally[]) => mount(ElectionResultsTally, {
        mocks: {
            $t: (msg: string): string => msg
        },
        propsData: {
            electionResults: {
                isComplete: true,
                ballotEntries: [
                    {
                        raceId: 'mockRaceId',
                        name: 'mockRaceName',
                        description: 'mockRaceDescription',
                        tallies,
                    },
                ],
            },
        },
        stubs: [
            'ElectionResultsTallyBar',
        ],
    });

    it('renders 25% and 75%', () => {
        const wrapper = getMountedWrapper([
            {
                selectionId: 'mockSelectionId0',
                name: 'mockName0',
                description: 'mockDescription0',
                party: 'mockParty0',
                voteCount: 1,
            },
            {
                selectionId: 'mockSelectionId1',
                name: 'mockName1',
                description: 'mockDescription1',
                party: 'mockParty1',
                voteCount: 3,
            },
        ]);
        expect(wrapper.element).toMatchSnapshot('with 25% and 75%');
    });

    it('renders 10% and 90%', () => {
        const wrapper = getMountedWrapper([
            {
                selectionId: 'mockSelectionId0',
                name: 'mockName0',
                description: 'mockDescription0',
                party: 'mockParty0',
                voteCount: 1,
            },
            {
                selectionId: 'mockSelectionId1',
                name: 'mockName1',
                description: 'mockDescription1',
                party: 'mockParty1',
                voteCount: 9,
            },
        ]);
        expect(wrapper.element).toMatchSnapshot('with 10% and 90%');
    });
});
