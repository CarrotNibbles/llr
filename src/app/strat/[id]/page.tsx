'use client';

import React from 'react';
import { TitleBar } from './components/titleBar';
import { StratTable } from './components/stratTable';

export default function Page({ params }: { params: { id: string } }): React.ReactElement {
  return (
    <div className="flex flex-col h-screen">
      <TitleBar id={params.id} />
      <StratTable />
    </div>
  );
}
