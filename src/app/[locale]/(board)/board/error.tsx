'use client';

import React from 'react';

type BoardErrorProps = {
  error: Error;
  reset: () => void;
}

export default function BoardError({ error, reset } : BoardErrorProps) {
  return <div>새</div>;
}
