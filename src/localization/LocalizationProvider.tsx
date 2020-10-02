import React, { createContext, useContext } from 'react';
import { InternationalizedText } from '../models';

export interface LocalizationContextValue {
    translate: (text?: InternationalizedText) => string;
}

export const LocalizationContext = createContext<LocalizationContextValue>({
    translate: () => '',
});

const ENGLISH = 'en';
const DEFAULT_IF_NOT_FOUND = '';

function english(intltext?: InternationalizedText) {
    if (!intltext) return DEFAULT_IF_NOT_FOUND;
    return intltext.text.filter((value) => value.language === ENGLISH)[0].value;
}

export const LocalizationProvider: React.FunctionComponent = ({ children }) => {
    // TODO: Support storing a current language and translating as needed
    const value = { translate: english };

    return <LocalizationContext.Provider value={value}>{children}</LocalizationContext.Provider>;
};

/**
 * Convenience hook for safely retrieving the Localization implementation
 * for use in a component.
 */
export function useLocalization() {
    const localization = useContext(LocalizationContext);

    if (!localization) {
        throw Error('Make sure to wrap the application in a <LocalizationProvider>!');
    }

    return localization;
}
