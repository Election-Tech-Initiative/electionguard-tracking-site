import { mount } from '@vue/test-utils';

import TheHeader from '@/components/TheHeader.vue';

describe('TheHeader.vue', () => {
    it('renders', () => {
        const wrapper = mount(TheHeader, {
            mocks: {
                appSettings: {
                    locationDescription: 'Mocked Location',
                },
                $t: (msg: string): string => msg
            },
            propsData: {
                pageTitle: 'Page Title'
            },
        });
        expect(wrapper.element).toMatchSnapshot();
    });
});
