"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { clearServiceWorkerCache } from "@/lib/clearCache";
import { useRouter } from "next/navigation";
import SelectedAvatarDisplay from "@/components/ui/SelectedAvatarDisplay";
import { UserIcon } from "@/components/icons/Icons";
import { DEFAULT_AVATAR, DEFAULT_COLOR } from "@/lib/avatar-constants";

interface UserProfileDropdownProps {
    userName: string;
}

export default function UserProfileDropdown({ userName }: UserProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [avatarId, setAvatarId] = useState<string>(DEFAULT_AVATAR);
    const [colorId, setColorId] = useState<string>(DEFAULT_COLOR);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Fetch avatar data
    useEffect(() => {
        async function fetchAvatar() {
            try {
                const res = await fetch("/api/user/avatar");
                if (res.ok) {
                    const data = await res.json();
                    setAvatarId(data.avatar || DEFAULT_AVATAR);
                    setColorId(data.avatarColor || DEFAULT_COLOR);
                }
            } catch (error) {
                console.error("Failed to fetch avatar:", error);
            }
        }
        fetchAvatar();
    }, []);

    const handleLogout = async () => {
        await clearServiceWorkerCache();
        signOut({ callbackUrl: "/login" });
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        router.push("/dashboard/profile");
    };

    const handleAvatarClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        router.push("/dashboard/avatar");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-white border-2 border-text/80 hover:border-text hover:bg-gray-50 transition-[border-color,background-color] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-text/30 focus:ring-offset-2 shadow-md focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                aria-label="User menu"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <SelectedAvatarDisplay 
                    avatarId={avatarId}
                    colorId={colorId}
                    size="md" 
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border/30 py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2 border-b border-border/30">
                        <p className="text-sm font-medium text-text truncate">{userName}</p>
                    </div>
                    <button
                        onClick={handleAvatarClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light transition-colors flex items-center gap-2"
                    >
                        <SelectedAvatarDisplay 
                            avatarId={avatarId}
                            colorId={colorId}
                            size="sm" 
                            className="pointer-events-none" 
                        />
                        Change Avatar
                    </button>
                    <button
                        onClick={handleProfileClick}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light transition-colors flex items-center gap-2"
                    >
                        <UserIcon className="w-4 h-4" />
                        View Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text hover:bg-bg-light transition-colors"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
