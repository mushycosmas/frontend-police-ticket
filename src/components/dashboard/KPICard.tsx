import React from 'react';
interface Props {
  title: string;
  value: string | number;
  target?: string;
  icon: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'default' | 'success' | 'warning' | 'danger';
}
const colorMap = {
  default: 'border-l-brand-primary bg-white',
  success: 'border-l-green-500 bg-white',
  warning: 'border-l-amber-500 bg-white',
  danger:  'border-l-red-500 bg-white',
};
const trendColor = {
  up:      'text-green-600',
  down:    'text-red-500',
  neutral: 'text-brand-muted',
};
export const KPICard: React.FC<Props> = ({
  title, value, target, icon, trend, trendValue, color = 'default',
}) => (
  <div className={`card border-l-4 ${colorMap[color]} flex items-start justify-between`}>
    <div>
      <p className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold text-brand-primary">{value}</p>
      {target && <p className="text-xs text-brand-muted mt-1">Target: {target}</p>}
      {trend && trendValue && (
        <p className={`text-xs font-medium mt-1 ${trendColor[trend]}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'} {trendValue}
        </p>
      )}
    </div>
    <div className="text-3xl opacity-80">{icon}</div>
  </div>
);
