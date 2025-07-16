import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { AuthButton } from './AuthButton';
import MobileChatToggle from './MobileChatToggle';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full border-b border-primary/20 bg-background/80 backdrop-blur-sm z-50 isolate">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-primary hover:text-primary/80 transition-colors">
                            FreeStep<span className="text-secondary">Rádio</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <AuthButton />

                        <div className="md:hidden">
                            <MobileChatToggle />
                        </div>
                    </div>

                </div>
            </nav>
        </header>
    );
};

export default Header;