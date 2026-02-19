"use client";

import { useState, useEffect } from "react";
import AvatarSelector from "./AvatarSelector";

export default function AvatarSection() {
    const [currentAvatar, setCurrentAvatar] = useState("cat");
    const [currentColor, setCurrentColor] = useState("blue");

    // Load saved selections on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem("selectedAvatar");
        const savedColor = localStorage.getItem("selectedColor");
        
        if (savedAvatar) setCurrentAvatar(savedAvatar);
        if (savedColor) setCurrentColor(savedColor);
    }, []);

    const handleAvatarChange = (avatarId: string) => {
        setCurrentAvatar(avatarId);
        localStorage.setItem("selectedAvatar", avatarId);
        // TODO: Save avatar to user profile
        console.log("Avatar changed to:", avatarId);
    };

    const handleColorChange = (colorId: string) => {
        setCurrentColor(colorId);
        localStorage.setItem("selectedColor", colorId);
        // TODO: Save color to user profile
        console.log("Color changed to:", colorId);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <AvatarSelector 
                currentAvatar={currentAvatar}
                currentColor={currentColor}
                onAvatarChange={handleAvatarChange}
                onColorChange={handleColorChange}
            />
        </div>
    );
}
