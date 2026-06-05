import React from 'react';
import { Button } from '../../../common/Button';

interface TicketsPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TicketsPagination: React.FC<TicketsPaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center p-3 border-t">
      <span className="text-sm text-gray-600">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};