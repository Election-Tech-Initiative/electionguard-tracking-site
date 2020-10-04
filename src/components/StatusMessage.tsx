import React from 'react';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IPalette, Stack, Text } from '@fluentui/react';
import { useTheme } from '@fluentui/react-theme-provider';

const iconStyle = {
    fontSize: 36,
    height: 36,
    width: 36,
    marginRight: 10,
};

const messageStyles = mergeStyles({
    fontSize: 20,
    fontWeight: 600,
});

export interface StatusMessageProps {
    icon?: string;
    message: string;
    colorName: keyof IPalette;
}

const StatusMessage: React.FunctionComponent<StatusMessageProps> = ({ icon, message, colorName }) => {
    const theme = useTheme();
    const color = theme.palette[colorName];

    const iconStyles = mergeStyles(iconStyle, { color });

    return (
        <Stack horizontal horizontalAlign="center" verticalAlign="center">
            {!!icon && <FontIcon iconName={icon} className={iconStyles} />}
            <Text variant="large" styles={{ root: { color } }} className={messageStyles}>
                {message}
            </Text>
        </Stack>
    );
};

export default StatusMessage;
