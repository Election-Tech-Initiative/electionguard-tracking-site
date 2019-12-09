import { mount } from '@vue/test-utils';

import BallotTrackingModal from '@/components/BallotTrackingModal.vue';

jest.mock('@/components/LanguageToggle.vue', () => ({ default: jest.fn() }));
jest.mock('@/components/LoadingIndicator.vue', () => ({ default: jest.fn() }));

describe('BallotTrackingModal.vue', () => {
    const getMountedWrapper = (status: number) => mount(BallotTrackingModal, {
        mocks: {
            appSettings: {
                commissionContact: 'Mocked Contact',
                locationDescription: 'Mocked Location',
            },
            $t: (msg: string): string => msg
        },
        propsData: {
            isActive: true,
            isLoading: false,
            selectedBallot: {
                approximateCastTime: new Date('July 31, 2019 12:30:00'),
                location: 'mockedLocation',
                status,
                trackingId: 'mockedTrackingId',
            },
        },
        stubs: [
            'i18n',
            'LanguageToggle',
            'LoadingIndicator',
        ],
    });

    it('renders for ballot counted', () => {
        const wrapper = getMountedWrapper(0);
        expect(wrapper.element).toMatchSnapshot('for ballot counted');
    });

    it('renders for ballot not found', () => {
        const wrapper = getMountedWrapper(404);
        expect(wrapper.element).toMatchSnapshot('for ballot not found');
    });

    it('renders for ballot discarded', () => {
        const wrapper = getMountedWrapper(-1);
        expect(wrapper.element).toMatchSnapshot('for ballot discarded');
    });
});
