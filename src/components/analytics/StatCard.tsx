interface Props {
  title: string;
  value: number;
  color?: string;
  icon?: string;
}

export const StatCard = ({
  title,
  value,
  color,
  icon,
}: Props) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    ...
  </div>
);