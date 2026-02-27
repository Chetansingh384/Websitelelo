import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Home', to: 'home' },
        { name: 'Services', to: 'services' },
        { name: 'Team', to: 'team' },
        { name: 'Pricing', to: 'pricing' },
        { name: 'Portfolio', to: 'portfolio' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/90 dark:bg-dark/90 backdrop-blur-md py-4 shadow-xl' : 'bg-black dark:bg-transparent py-6'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center space-x-3 cursor-pointer group">
                    <div className="relative">
                        <img
                            src="/assets/logo.png"
                            alt="WebsiteLelo Logo"
                            className="w-14 h-14 object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-2xl"
                        />
                    </div>
                    <div className="text-2xl font-black gradient-text tracking-tighter">
                        WebsiteLelo
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 items-center">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            spy={true}
                            smooth={true}
                            offset={-80}
                            duration={500}
                            activeClass="nav-active"
                            className="text-gray-300 hover:text-white transition-colors cursor-pointer relative py-2 text-sm font-bold tracking-wide"
                        >
                            {item.name}
                        </Link>
                    ))}

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white transition-all shadow-inner border border-white/5"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <Link to="contact" smooth={true} duration={500} offset={-80} className="hidden md:block">
                        <button className="btn-primary py-2.5 px-6">
                            Get In Touch
                        </button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center space-x-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-xl bg-white/5 text-gray-400 border border-white/5"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                    <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-black/95 dark:bg-dark/95 backdrop-blur-xl absolute w-full px-6 py-8 flex flex-col space-y-6 border-b border-white/5 animate-in slide-in-from-top-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            smooth={true}
                            duration={500}
                            onClick={() => setIsOpen(false)}
                            offset={-80}
                            className="text-xl font-bold text-gray-300 hover:text-white"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Link to="contact" smooth={true} duration={500} offset={-80} onClick={() => setIsOpen(false)}>
                        <button className="btn-primary w-full py-4 rounded-2xl">
                            Get In Touch
                        </button>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
