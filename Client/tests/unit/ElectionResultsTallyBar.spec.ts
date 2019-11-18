import { mount } from '@vue/test-utils';

import ElectionResultsTallyBar from '@/components/ElectionResultsTallyBar.vue';

describe('ElectionResultsTally.vue', () => {
    const getMountedWrapper = (isFirst: boolean) => mount(ElectionResultsTallyBar, {
        mocks: {
            $t: (msg: string): string => msg
        },
        propsData: {
            isFirst,
            count: '5',
            percentage: '50%',
        },
    });

    it('renders with first class', () => {
        const wrapper = getMountedWrapper(true);
        expect(wrapper.element).toMatchSnapshot('with first class');
    });

    it('renders without first class', () => {
        const wrapper = getMountedWrapper(false);
        expect(wrapper.element).toMatchSnapshot('without first class');
    });
});
