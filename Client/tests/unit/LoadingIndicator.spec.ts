import { mount } from '@vue/test-utils';

import LoadingIndicator from '@/components/LoadingIndicator.vue';

describe('LoadingIndicator.vue', () => {
    it('renders', () => {
        const wrapper = mount(LoadingIndicator);
        expect(wrapper.element).toMatchSnapshot();
    });
});
