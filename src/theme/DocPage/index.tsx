import React from 'react';
import OriginalDocPage from '@theme-original/DocPage';

export default function DocPageWrapper(props) {
  return (
    <>
      <OriginalDocPage {...props} />
    </>
  );
}