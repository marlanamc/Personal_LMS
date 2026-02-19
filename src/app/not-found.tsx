import Link from 'next/link';
import { BackButton } from '@/components/ui/BackButton';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-bg to-bg-light flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary mb-4 font-display">404</h1>
                    <h2 className="text-3xl font-bold text-text mb-4 font-display">Page Not Found</h2>
                    <p className="text-text-muted text-lg mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-border/30">
                    <div className="space-y-4">
                        <Link
                            href="/dashboard"
                            className="block w-full px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all shadow-md hover:shadow-lg"
                        >
                            Go to Dashboard
                        </Link>
                        <BackButton href="/login" className="w-full justify-center">Back to Login</BackButton>
                    </div>
                </div>

                <p className="mt-6 text-sm text-text-muted">
                    If you believe this is an error, please contact your teacher.
                </p>
            </div>
        </div>
    );
}
