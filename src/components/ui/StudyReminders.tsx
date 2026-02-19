"use client";

import { useState, useEffect } from "react";

interface StudyRemindersProps {
    className?: string;
}

interface Reminder {
    id: string;
    time: string;
    label: string;
    enabled: boolean;
    days: string[];
}

const DEFAULT_REMINDERS: Reminder[] = [
    { id: "morning", time: "09:00", label: "Morning Study", enabled: false, days: ["mon", "tue", "wed", "thu", "fri"] },
    { id: "afternoon", time: "14:00", label: "Afternoon Practice", enabled: false, days: ["mon", "tue", "wed", "thu", "fri"] },
    { id: "evening", time: "19:00", label: "Evening Review", enabled: false, days: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] },
    { id: "weekend", time: "10:00", label: "Weekend Session", enabled: false, days: ["sat", "sun"] },
];

export default function StudyReminders({ className = "" }: StudyRemindersProps) {
    const [reminders, setReminders] = useState<Reminder[]>(DEFAULT_REMINDERS);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        // Check if browser supports notifications
        if ("Notification" in window && "serviceWorker" in navigator) {
            setIsSupported(true);
        }
    }, []);

    const requestPermission = async () => {
        if (!isSupported) return false;
        
        try {
            const permission = await Notification.requestPermission();
            return permission === "granted";
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    };

    const toggleReminder = (id: string) => {
        setReminders(prev => 
            prev.map(reminder => 
                reminder.id === id 
                    ? { ...reminder, enabled: !reminder.enabled }
                    : reminder
            )
        );
    };

    const toggleDay = (reminderId: string, day: string) => {
        setReminders(prev =>
            prev.map(reminder =>
                reminder.id === reminderId
                    ? {
                        ...reminder,
                        days: reminder.days.includes(day)
                            ? reminder.days.filter(d => d !== day)
                            : [...reminder.days, day]
                    }
                    : reminder
            )
        );
    };

    const saveReminders = async () => {
        // Save to localStorage
        localStorage.setItem("studyReminders", JSON.stringify(reminders));
        
        // Request notification permission if not granted
        const hasEnabledReminders = reminders.some(r => r.enabled);
        if (hasEnabledReminders && isSupported) {
            const granted = await requestPermission();
            if (granted) {
                // Schedule notifications (this would need a service worker for real implementation)
                console.log("Reminders saved and notifications enabled");
            }
        }
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const DAY_LABELS: Record<string, string> = {
        mon: "Mon",
        tue: "Tue", 
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
        sun: "Sun"
    };

    return (
        <div className={`space-y-6 ${className}`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Study Reminders</h3>
                <p className="text-sm text-gray-600">
                    Set up study reminders to stay on track with your learning goals
                </p>
            </div>

            {!isSupported && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        ⚠️ Your browser doesn't support notifications. Reminders will only work when you have the app open.
                    </p>
                </div>
            )}

            <div className="space-y-4">
                {reminders.map((reminder) => (
                    <div key={reminder.id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => toggleReminder(reminder.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        reminder.enabled ? "bg-primary" : "bg-gray-200"
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                            reminder.enabled ? "translate-x-6" : "translate-x-1"
                                        }`}
                                    />
                                </button>
                                <div>
                                    <p className="font-medium text-gray-900">{reminder.label}</p>
                                    <p className="text-sm text-gray-500">{formatTime(reminder.time)}</p>
                                </div>
                            </div>
                        </div>

                        {reminder.enabled && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Repeat:</span>
                                {Object.entries(DAY_LABELS).map(([key, label]) => (
                                    <button
                                        key={key}
                                        onClick={() => toggleDay(reminder.id, key)}
                                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                                            reminder.days.includes(key)
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-gray-200 text-gray-500 hover:border-gray-300"
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={saveReminders}
                className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
            >
                Save Reminders
            </button>

            <div className="text-xs text-gray-500 text-center">
                💡 Tip: Enable notifications to get reminders even when the app is closed
            </div>
        </div>
    );
}
