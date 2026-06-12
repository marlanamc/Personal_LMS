import { type RefObject } from "react";
import { type GuideHub } from "@/content/guide-hubs";

export interface Activity {
    id: string;
    title: string;
    description: string | null;
    type: string;
    category: string | null;
    level: string | null;
    ui: string | null;
    content?: string;
}

export interface SubSubCategory {
    name: string;
    activities: Activity[];
}

export interface SubCategory {
    name: string;
    activities: Activity[];
    subCategories?: SubSubCategory[];
}

export interface Category {
    name: string;
    color: string;
    subCategories?: SubCategory[];
    activities: Activity[];
}

export interface ActivityCategoriesProps {
    activities: Activity[];
    completedActivityIds?: Set<string> | string[];
    progressMap?: Record<string, { progress: number; categoryData?: string }>;
    showEmpty?: boolean;
    filterCategory?: string;
    canFeatureActivities?: boolean;
    defaultClassId?: string | null;
    initialFeatureAssignments?: Record<string, { assignmentId: string; isFeatured: boolean }>;
    /** Ref map for section labels — used by Quick-Jump pill nav to scroll to sections */
    sectionRefs?: RefObject<Record<string, HTMLElement | null>>;
    /** Hub definitions for the current subject — causes guide activities to render as hub cards */
    guideHubs?: GuideHub[];
    /** Called when a hub card is clicked */
    onHubSelect?: (hub: GuideHub) => void;
}
