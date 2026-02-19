import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#fef9f3' }}>
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#d97757' }}>
                        Class Companion
                    </h1>
                    <p className="text-sm mb-6" style={{ color: '#7ba884', fontWeight: '600' }}>
                        ESOL Level 3
                    </p>
                    <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: '#2b3a4a' }}>
                        Sign in to your account
                    </h2>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
