import type { ComparisonRow } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface ComparisonTableProps {
    comparison: {
        title: string;
        leftLabel: string;
        rightLabel: string;
        rows: ComparisonRow[];
    };
}

export function ComparisonTable({ comparison }: ComparisonTableProps) {
    return (
        <div className="comparison-table my-6">
            <h4 className="text-base font-bold text-text mb-4">{comparison.title}</h4>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {comparison.rows.map((row, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
                        <div className="bg-bg-light border-b border-border px-4 py-2">
                            <div className="text-sm font-semibold text-text">{row.label}</div>
                        </div>
                        <div className="divide-y divide-border">
                            <div className="px-4 py-3 bg-warning/5">
                                <div className="text-sm font-semibold text-warning mb-1">{comparison.leftLabel}</div>
                                <div 
                                    className="text-sm text-text"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.left) }}
                                />
                            </div>
                            <div className="px-4 py-3 bg-success/5">
                                <div className="text-sm font-semibold text-success mb-1">{comparison.rightLabel}</div>
                                <div 
                                    className="text-sm text-text"
                                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.right) }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View with Scroll Indicator */}
            <div className="hidden md:block relative">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                        <thead>
                            <tr>
                                <th className="bg-bg-light border border-border p-3 text-left text-sm font-semibold text-text min-w-[120px]">
                                    Category
                                </th>
                                <th className="bg-warning/10 border border-border p-3 text-left text-sm font-semibold text-warning min-w-[200px]">
                                    {comparison.leftLabel}
                                </th>
                                <th className="bg-success/10 border border-border p-3 text-left text-sm font-semibold text-success min-w-[200px]">
                                    {comparison.rightLabel}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparison.rows.map((row, index) => (
                                <tr key={index} className="hover:bg-bg-light/50 transition-colors">
                                    <td className="border border-border p-3 text-sm font-medium text-text">
                                        {row.label}
                                    </td>
                                    <td 
                                        className="border border-border p-3 text-sm text-text"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.left) }}
                                    />
                                    <td 
                                        className="border border-border p-3 text-sm text-text"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(row.right) }}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
