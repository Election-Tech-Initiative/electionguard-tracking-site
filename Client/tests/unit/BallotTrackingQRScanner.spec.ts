import { mount } from '@vue/test-utils';

import BallotTrackingQrScanner from '@/components/BallotTrackingQrScanner.vue';

jest.mock('vue-qrcode-reader', () => ({ QrcodeCapture: jest.fn(), QrcodeStream: jest.fn() }));
jest.mock('@/components/LoadingIndicator.vue', () => ({ default: jest.fn() }));

describe('BallotTrackingQrScanner.vue', () => {
    const mockedRouterPush = jest.fn();

    const getMountedWrapper = () => mount(BallotTrackingQrScanner, {
        mocks: {
            $router: {
                push: mockedRouterPush,
            },
            $t: (msg: string): string => msg
        },
        stubs: [
            'LoadingIndicator',
            'QrcodeCapture',
            'QrcodeStream',
        ],
    });

    it('renders', () => {
        const wrapper = getMountedWrapper();
        expect(wrapper.element).toMatchSnapshot();
    });

    it('renders with openModal', () => {
        const wrapper = getMountedWrapper();
        wrapper.find('button').trigger('click');
        expect(wrapper.element).toMatchSnapshot('with openModal');
    });

    it('renders error when detection fails', async () => {
        const wrapper = getMountedWrapper();
        (wrapper.vm as any).onDetect(Promise.reject(new Error('error')));
        await wrapper.vm.$nextTick();
        expect(wrapper.element).toMatchSnapshot('with error when detection fails');
    });

    it('renders error when result does\'t start with ${window.location.origin}/track/', async () => {
        const wrapper = getMountedWrapper();
        (wrapper.vm as any).onDetect(Promise.resolve({ content: 'invalid result' }));
        await wrapper.vm.$nextTick();
        expect(wrapper.element).toMatchSnapshot('with error when result invalid');
    });

    it('routes to tracking url when result starts with ${window.location.origin}/track', async () => {
        const wrapper = getMountedWrapper();
        const expectedSubUrl = 'track/mocked-url';
        (wrapper.vm as any).onDetect(Promise.resolve({ content: `${window.location.origin}/${expectedSubUrl}` }));
        await wrapper.vm.$nextTick();
        expect(mockedRouterPush).toBeCalledWith(expectedSubUrl);
    });
});
