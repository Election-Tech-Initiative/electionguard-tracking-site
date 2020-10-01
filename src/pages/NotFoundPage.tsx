import React from 'react';
import Title from '../components/Title';

const notFound = 'Not Found';

export interface NotFoundPageProps {}

const NotFoundPage: React.FunctionComponent<NotFoundPageProps> = () => <Title title={`404 ${notFound}`} />;

export default NotFoundPage;
