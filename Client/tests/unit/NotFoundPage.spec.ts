import { mount, RouterLinkStub } from '@vue/test-utils';

import NotFoundPage from '@/views/NotFoundPage.vue';

describe('NotFoundPage.vue', () => {
    it('renders', () => {
        const wrapper = mount(NotFoundPage, {
            mocks: {
                $t: (msg: string): string => msg
            },
            stubs: {
                i18n: true,
                RouterLink: RouterLinkStub,
            }
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
