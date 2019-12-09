import { mount } from '@vue/test-utils';

import BallotTracking from '@/views/BallotTracking.vue';

jest.mock('@/components/BallotTrackingLookup.vue', () => ({ default: jest.fn() }));
jest.mock('@/components/BallotTrackingModal.vue', () => ({ default: jest.fn() }));
jest.mock('@/components/BallotTrackingQRScanner.vue', () => ({ default: jest.fn() }));
jest.mock('@/components/PreElectionGuard.vue', () => ({ default: jest.fn() }));

describe('BallotTracking.vue', () => {
    const wrapper = mount(BallotTracking, {
        mocks: {
            appSettings: {
                apiUrl: 'mocked.url',
                electionDate: 'June 20, 2019',
                locationDescription: 'Mocked Location',
            },
            $http: {
                get: () => Promise.resolve({ data: { isComplete: true, ballotEntries: [] } }),
            },
            $t: (msg: string): string => msg,
        },
        stubs: [
            'BallotTrackingLookup',
            'BallotTrackingModal',
            'BallotTrackingQRScanner',
            'PreElectionGuard',
        ],
    });

    it('renders', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('showModal is set to falsey when no initial ballotId prop', () => {
        expect((wrapper.vm as any).showModal).toBeFalsy();
    });

    it('showModal is set to true when ballotId prop gets set', () => {
        wrapper.setProps({ ballotId: expect.any(String)});
        expect((wrapper.vm as any).showModal).toBe(true);
    });
});
