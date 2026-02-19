import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 font-display text-primary">
                        Marlie LMS
                    </h1>
                    <p className="text-sm mb-6 font-semibold text-secondary">
                        Personal Learning Workspace
                    </p>
                    <h2 className="text-2xl font-bold mb-4 font-display text-text">
                        Sign in to your account
                    </h2>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
