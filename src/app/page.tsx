import Link from "next/link";

export default function Home() {
    return (
        <div className="min-h-screen relative overflow-hidden" style={{
            background: "linear-gradient(135deg, #fdfbf7 0%, #f4f1ea 50%, #e9e6df 100%)"
        }}>
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "4s" }}></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: "6s" }}></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-12 sm:py-20 flex flex-col items-center justify-center min-h-screen">
                {/* Header */}
                <header className="text-center space-y-8 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                        <p className="text-xs sm:text-sm uppercase tracking-[0.15em] text-primary-dark font-semibold">
                            ESOL Learning Platform
                        </p>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight text-text">
                        <span className="inline-block">Class</span>{" "}
                        <span className="inline-block relative">
                            Companion
                            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 10C52 4 148 -2 298 10" stroke="#e9c46a" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    <div className="flex flex-col items-center justify-center gap-3 pt-4">
                        <Link
                            href="/login"
                            className="group inline-flex items-center justify-center px-8 py-4 rounded-full bg-primary text-white font-semibold shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                        >
                            <span>Log In</span>
                            <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </header>
            </div>
        </div>
    );
}

