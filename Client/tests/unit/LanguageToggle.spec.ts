import { mount } from '@vue/test-utils';

import LanguageToggle from '@/components/LanguageToggle.vue';

jest.mock('@/i18n', () => ({ getSupportedLanguages: () => [['en', 'English'], ['es', 'Spanish']] }));

describe('LanguageToggle.vue', () => {
    const mockedPath = 'mocked.path';
    const mockRouterPush = jest.fn();
    const wrapper = mount(LanguageToggle, {
        mocks: {
            $i18n: {
                locale: 'en',
            },
            $route: {
                path: mockedPath,
            },
            $router: {
                push: mockRouterPush,
            },
            $t: (msg: string): string => msg
        },
    });

    it('renders', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('changing language pushes new route with lang query string', () => {
        const lang = 'es';
        const select = wrapper.find('select');
        select.setValue(lang);
        expect(mockRouterPush).toBeCalledWith(`${mockedPath}?lang=${lang}`);
    });

    it('$i18n.locale change updates selectedLanguage', () => {
        wrapper.setData({ $i18n: { locale: 'fr' }});
        expect((wrapper.vm as any).selectedLanguage).toBe('fr');
    });
});
