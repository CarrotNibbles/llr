'use client';

import React from 'react';
import { TitleBar } from './components/titleBar';
import { MechanicsTable } from './components/mechanicsTable';

export default function Page({ params }: { params: { id: string } }): React.ReactElement {
  return (
    <div className="flex flex-col h-screen">
      <TitleBar id={params.id} />
      <MechanicsTable />
    </div>
  );
}
