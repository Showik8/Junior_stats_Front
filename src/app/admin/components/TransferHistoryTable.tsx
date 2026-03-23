"use client";
import React, { useState, useEffect } from "react";
import { schoolService } from "@/services/school.service";
import type { PlayerTransfer, SchoolListMeta } from "@/types/school.types";
import AgeCategoryBadge from "./AgeCategoryBadge";
import Button from "./Button";

interface TransferHistoryTableProps {
  schoolId: string;
}

const TransferHistoryTable: React.FC<TransferHistoryTableProps> = ({ schoolId }) => {
  const [transfers, setTransfers] = useState<PlayerTransfer[]>([]);
  const [meta, setMeta] = useState<SchoolListMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchTransfers = async (p: number) => {
    try {
      setLoading(true);
      const result = await schoolService.getTransferHistory(schoolId, {
        page: p,
        limit: 10,
      });
      setTransfers(result.transfers);
      setMeta(result.meta);
    } catch (err) {
      console.error("Failed to fetch transfers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId, page]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("ka-GE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  if (transfers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 italic">
        გადაყვანების ისტორია ცარიელია
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">მოთამაშე</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">საიდან</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">სად</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">მიზეზი</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">თარიღი</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transfers.map((transfer) => (
              <tr key={transfer.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">{transfer.player.name}</span>
                    {transfer.player.position && (
                      <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {transfer.player.position}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{transfer.fromTeam.name}</span>
                    <AgeCategoryBadge category={transfer.fromTeam.ageCategory} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{transfer.toTeam.name}</span>
                    <AgeCategoryBadge category={transfer.toTeam.ageCategory} />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transfer.reason || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(transfer.transferredAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            გვერდი {meta.page} / {meta.totalPages}
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              წინა
            </Button>
            <Button
              variant="secondary"
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
            >
              შემდეგი
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferHistoryTable;
