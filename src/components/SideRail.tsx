'use client';

import React from 'react';

interface SideRailProps {
  statusText?: string;
  subText?: string;
}

export default function SideRail({ statusText = 'NODE: PUBLIC', subText = 'SYSTEM: OPERATIONAL' }: SideRailProps) {
  return (
    <div className="side-rail hidden lg:flex">
      <div className="rail-text">
        INSTITUTIONAL.NODE.IIITB
      </div>
      <div className="rail-text" style={{ color: 'var(--hr-green)' }}>
        {subText}
      </div>
      <div className="rail-text" style={{ color: '#888' }}>
        {statusText}
      </div>
    </div>
  );
}
