import { mount, RouterLinkStub } from '@vue/test-utils';

import NotFoundPage from '@/components/PreElectionGuard.vue';

describe('PreElectionGuard.vue', () => {
    it('renders preElectionMessage when election not closed', () => {
        const wrapper = mount(NotFoundPage, {
            mocks: {
                appSettings: {
                    electionClosed: 'false',
                    electionDate: 'June 20, 2019',
                },
                $t: (msg: string): string => msg
            },
            slots: {
                default: '<div />',
            },
        });
        expect(wrapper.element).toMatchSnapshot('election not closed');
    });

    it('renders slot div when election is closed', () => {
        const wrapper = mount(NotFoundPage, {
            mocks: {
                appSettings: {
                    electionClosed: 'true',
                    electionDate: 'June 20, 2019',
                },
                $t: (msg: string): string => msg
            },
            slots: {
                default: '<div />',
            },
        });
        expect(wrapper.element).toMatchSnapshot('election is closed');
    });
});
