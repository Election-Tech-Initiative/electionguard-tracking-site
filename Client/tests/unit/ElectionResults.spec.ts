import { mount } from '@vue/test-utils';

import ElectionResults from '@/views/ElectionResults.vue';

jest.mock('@/components/ElectionResultsTally.vue', () => ({ default: jest.fn() }));
jest.mock('@/components/LoadingIndicator.vue', () => ({ default: jest.fn() }));
jest.mock('@/components/PreElectionGuard.vue', () => ({ default: jest.fn() }));

describe('ElectionResults.vue', () => {
    const getMountedWrapper = () => mount(ElectionResults, {
        mocks: {
            appSettings: {
                apiUrl: 'mocked.url',
            },
            $http: {
                get: () => Promise.resolve({ data: { isComplete: true, ballotEntries: [] }, status: 200 }),
            },
        },
        stubs: [
            'ElectionResultsTally',
            'LoadingIndicator',
            'PreElectionGuard',
        ],
    });

    it('renders with LoadingIndicator', () => {
        const wrapper = getMountedWrapper();
        expect(wrapper.element).toMatchSnapshot('withLoadingIndicator');
    });

    it('renders with ElectionResultsTally after async fetch', async () => {
        const wrapper = getMountedWrapper();
        await wrapper.vm.$nextTick();
        expect(wrapper.element).toMatchSnapshot('withElectionResultsTally');
    });
});
