export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'OPEN': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'ASSIGNED': 'bg-blue-100 text-blue-800 border-blue-200',
    'IN_PROGRESS': 'bg-indigo-100 text-indigo-800 border-indigo-200',
    'RESOLVED': 'bg-green-100 text-green-800 border-green-200',
    'CLOSED': 'bg-gray-100 text-gray-800 border-gray-200',
    'REOPENED': 'bg-purple-100 text-purple-800 border-purple-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'CRITICAL': 'bg-red-100 text-red-800',
    'P1_CRITICAL': 'bg-red-100 text-red-800',
    'HIGH': 'bg-orange-100 text-orange-800',
    'P2_HIGH': 'bg-orange-100 text-orange-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'P3_MEDIUM': 'bg-yellow-100 text-yellow-800',
    'LOW': 'bg-green-100 text-green-800',
    'P4_LOW': 'bg-green-100 text-green-800',
  };
  return colors[priority] || 'bg-gray-100 text-gray-800';
};

export const getCategoryColor = (category: string): string => {
  const colors = [
    'bg-indigo-100 text-indigo-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800',
    'bg-amber-100 text-amber-800',
    'bg-emerald-100 text-emerald-800',
    'bg-rose-100 text-rose-800',
    'bg-fuchsia-100 text-fuchsia-800',
    'bg-sky-100 text-sky-800',
  ];
  const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};