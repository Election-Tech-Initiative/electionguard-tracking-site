import React from 'react';
import { Stack } from '@fluentui/react';

export interface LayoutProps {}

const Layout: React.FunctionComponent<LayoutProps> = ({ children }) => {
    return <Stack verticalFill>{children || null}</Stack>;
};

export default Layout;
