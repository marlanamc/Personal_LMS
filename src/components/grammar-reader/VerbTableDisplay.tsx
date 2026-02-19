import type { VerbTable } from "@/types/activity";
import { sanitizeHtml } from "@/utils/sanitize";

interface VerbTableDisplayProps {
    table: VerbTable;
}

export function VerbTableDisplay({ table }: VerbTableDisplayProps) {
    return (
        <div className="verb-table-display my-6">
            <h4 className="text-base font-bold text-text mb-4">{table.title}</h4>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                    <thead>
                        <tr>
                            {table.headers.map((header, index) => (
                                <th
                                    key={index}
                                    className="bg-primary text-white border border-primary/20 p-3 text-left text-sm font-semibold"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {table.rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className="hover:bg-bg-light/50 transition-colors"
                            >
                                {row.map((cell, cellIndex) => (
                                    <td
                                        key={cellIndex}
                                        className="border border-border p-3 text-sm text-text"
                                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(cell) }}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
