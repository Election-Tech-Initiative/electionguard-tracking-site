import { mount, RouterLinkStub } from '@vue/test-utils';

import TheFooter from '@/components/TheFooter.vue';

jest.mock('@/components/LanguageToggle.vue', () => ({ default: jest.fn() }));

describe('TheFooter.vue', () => {
    it('renders', () => {
        const wrapper = mount(TheFooter, {
            mocks: {
                appSettings: {
                    locationDescription: 'Mocked Location',
                    locationDescription2: 'Mocked Location 2',
                },
                $route: {
                    query: {
                        lang: 'mockedLang',
                    },
                },
                $t: (msg: string): string => msg
            },
            stubs: {
                LanguageToggle: true,
                RouterLink: RouterLinkStub,
            }
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
