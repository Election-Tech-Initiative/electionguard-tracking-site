import { mount } from '@vue/test-utils';

import BallotTrackingLookup from '@/components/BallotTrackingLookup.vue';
import { BallotStatus } from '@/models/BallotStatus';

const mockedBallots = [{
    approximateCastTime: new Date('July 31, 2019 12:30:00'),
    location: 'mockedLocation',
    status: 0,
    trackingId: 'mockedTrackingId',
}];

describe('BallotTrackingLookup.vue', () => {
    const getMountedWrapper = (ballotData: BallotStatus[]) => mount(BallotTrackingLookup, {
        mocks: {
            appSettings: {
                apiUrl: 'mocked-url',
            },
            $http: {
                get: async (): Promise<any> => Promise.resolve({
                    status: 200,
                    data: ballotData,
                }),
            },
            $t: (msg: string): string => msg
        },
    });

    it('renders', async () => {
        const wrapper = getMountedWrapper([]);
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders with not found', async () => {
        const wrapper = getMountedWrapper([]);
        await (wrapper.vm as any).lookupBallots('emptyquery');
        wrapper.find('input').trigger('click'); // opens the dropdown results
        expect(wrapper.element).toMatchSnapshot('with not found');
    });

    it('renders with a suggestion', async () => {
        const wrapper = getMountedWrapper(mockedBallots);
        await (wrapper.vm as any).lookupBallots('mocked');
        wrapper.find('input').trigger('click'); // opens the dropdown results
        expect(wrapper.element).toMatchSnapshot('with a suggestion');
    });

    it('emits selected ballot when onSelected', () => {
        const wrapper = getMountedWrapper(mockedBallots);
        (wrapper.vm as any).onSelected({ item: mockedBallots[0] });
        expect(wrapper.emitted().selected).toBeTruthy();
    });
});
