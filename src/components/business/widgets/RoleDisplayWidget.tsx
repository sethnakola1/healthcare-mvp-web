
// components/business/widgets/RoleDisplayWidget.tsx
import React from 'react';
// import { BusinessRole, ROLE_DISPLAY_NAMES } from '../../../types/business.types';
import { Badge } from '../../common/Badge';

interface RoleDisplayWidgetProps {
  role: BusinessRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RoleDisplayWidget: React.FC<RoleDisplayWidgetProps> = ({
  role,
  showIcon = true,
  size = 'md',
}) => {
  const roleColors = {
    [BusinessRole.SUPER_ADMIN]: 'error',
    [BusinessRole.TECH_ADVISOR]: 'info',
  } as const;

  const roleIcons = {
    [BusinessRole.SUPER_ADMIN]: (
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    [BusinessRole.TECH_ADVISOR]: (
      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
      </svg>
    ),
  };

  return (
    <Badge variant={roleColors[role]} size={size}>
      {showIcon && roleIcons[role]}
      {ROLE_DISPLAY_NAMES[role]}
    </Badge>
  );
};
