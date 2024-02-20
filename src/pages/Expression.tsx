import React from 'react';

import ExpressionEditor from '@components/ExpresionEditor/ExpresionEditor.tsx';

const ExpressionPage: React.FC<ExpressionPageProps> = () => (
  <div>
    <ExpressionEditor />
  </div>
);

interface ExpressionPageProps {}

export default ExpressionPage;
