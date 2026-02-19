export function ActivityCardSkeleton() {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
            
            {/* Content */}
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-between mt-6">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-bg">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            
            {/* Stats Cards */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                            <div className="h-12 bg-gray-200 rounded w-12 mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-20"></div>
                        </div>
                    ))}
                </div>
                
                {/* Activity Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <ActivityCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export function ButtonSkeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`h-10 bg-gray-200 rounded-lg animate-pulse ${className}`}></div>
    );
}

export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={`h-4 bg-gray-200 rounded animate-pulse ${
                        i === lines - 1 ? "w-3/4" : "w-full"
                    }`}
                ></div>
            ))}
        </div>
    );
}
