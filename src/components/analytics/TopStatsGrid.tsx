interface Props {
  stats: AnalyticsData;
}

export const TopStatsGrid = ({ stats }: Props) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    ...
  </div>
);