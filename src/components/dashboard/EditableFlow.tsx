"use client";

import { useState } from "react";
import { TeachingScheduleFlowItem } from "@/lib/teachingSchedule";

interface EditableFlowProps {
    flow: TeachingScheduleFlowItem[];
    day: "Tuesday" | "Thursday";
    onSave: (flow: TeachingScheduleFlowItem[]) => Promise<void>;
}

export function EditableFlow({ flow, day, onSave }: EditableFlowProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedFlow, setEditedFlow] = useState(flow);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleEdit = () => {
        setEditedFlow(flow);
        setIsEditing(true);
        setError("");
        setSuccess(false);
    };

    const handleCancel = () => {
        setEditedFlow(flow);
        setIsEditing(false);
        setError("");
        setSuccess(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        setSuccess(false);

        try {
            await onSave(editedFlow);
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const addItem = () => {
        setEditedFlow([...editedFlow, { time: "", activity: "" }]);
    };

    const removeItem = (index: number) => {
        setEditedFlow(editedFlow.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: "time" | "activity", value: string) => {
        const updated = [...editedFlow];
        updated[index] = { ...updated[index]!, [field]: value };
        setEditedFlow(updated);
    };

    const moveItemUp = (index: number) => {
        if (index === 0) return;
        const updated = [...editedFlow];
        [updated[index - 1], updated[index]] = [updated[index]!, updated[index - 1]!];
        setEditedFlow(updated);
    };

    const moveItemDown = (index: number) => {
        if (index === editedFlow.length - 1) return;
        const updated = [...editedFlow];
        [updated[index], updated[index + 1]] = [updated[index + 1]!, updated[index]!];
        setEditedFlow(updated);
    };

    if (!isEditing) {
        return (
            <div className="pt-3 border-t border-text/10">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-text/75">Class Flow:</div>
                    <button
                        onClick={handleEdit}
                        className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                        ✏️ Edit
                    </button>
                </div>
                <div className="space-y-1">
                    {flow.length === 0 ? (
                        <div className="text-xs text-text/75 italic">No flow items. Click Edit to add.</div>
                    ) : (
                        flow.map((item, idx) => (
                            <div key={idx} className="grid grid-cols-[2rem_1fr] gap-x-2 text-xs text-text/80">
                                <span className="font-mono tabular-nums text-text/70">{idx + 1}.</span>
                                <span className="min-w-0 break-words leading-snug">{item.activity}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="pt-3 border-t border-text/10">
            <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-medium text-text/75">Class Flow:</div>
                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-xs text-primary hover:text-primary/80 font-medium disabled:opacity-50"
                    >
                        {isSaving ? "Saving…" : "💾 Save"}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="text-xs text-text/75 hover:text-text/90 font-medium disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-2 rounded-lg border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-700">
                    ✓ Saved successfully!
                </div>
            )}

            <div className="space-y-2">
                {editedFlow.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start">
                        <span className="flex-shrink-0 px-2 py-1 text-xs font-mono text-text/70 tabular-nums">
                            {idx + 1}.
                        </span>
                        <input
                            type="text"
                            value={item.activity}
                            onChange={(e) => updateItem(idx, "activity", e.target.value)}
                            placeholder="Activity"
                            className="flex-1 min-w-0 px-2 py-1 text-xs border border-border/50 rounded bg-bg focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                            onClick={() => moveItemUp(idx)}
                            disabled={idx === 0}
                            className="px-2 py-1 text-xs text-text/75 hover:bg-text/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move up"
                        >
                            ↑
                        </button>
                        <button
                            onClick={() => moveItemDown(idx)}
                            disabled={idx === editedFlow.length - 1}
                            className="px-2 py-1 text-xs text-text/75 hover:bg-text/10 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move down"
                        >
                            ↓
                        </button>
                        <button
                            onClick={() => removeItem(idx)}
                            className="px-2 py-1 text-xs text-error hover:bg-error/10 rounded"
                            title="Remove"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    onClick={addItem}
                    className="w-full px-3 py-1.5 text-xs border border-border/50 rounded bg-bg-light hover:bg-bg transition text-text/80"
                >
                    + Add Item
                </button>
            </div>
        </div>
    );
}

