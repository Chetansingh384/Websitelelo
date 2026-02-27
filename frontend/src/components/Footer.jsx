import { Instagram } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark border-t border-white/5 pt-20 pb-10">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="sm:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <img
                                src="/assets/logo.png"
                                alt="WebsiteLelo"
                                className="w-12 h-12 rounded-xl object-contain border border-white/10"
                            />
                            <h3 className="text-2xl font-black gradient-text tracking-tighter">WebsiteLelo</h3>
                        </div>
                        <p className="text-gray-400 max-w-sm mb-8">
                            Making professional websites affordable and accessible for everyone. Your success is our mission.
                        </p>
                        <div className="flex space-x-6">
                            <a href="https://instagram.com/websitelelo" target="_blank" rel="noopener noreferrer">
                                <Instagram size={40} className="nav-link hover:text-primary transition-all cursor-pointer" />
                            </a>
                            <a href="https://wa.me/917418333256?text=Hi!%20I'm%20interested%20in%20WebsiteLelo's%20services.%20Can%20we%20have%20a%20chat?" target="_blank" rel="noopener noreferrer">
                                <svg
                                    viewBox="0 0 24 24"
                                    width="40"
                                    height="40"
                                    fill="currentColor"
                                    className="nav-link hover:text-primary transition-all cursor-pointer"
                                >
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><ScrollLink to="home" smooth={true} duration={500} className="hover:text-primary cursor-pointer transition-colors font-medium">Home</ScrollLink></li>
                            <li><ScrollLink to="services" smooth={true} duration={500} offset={-80} className="hover:text-primary cursor-pointer transition-colors font-medium">Services</ScrollLink></li>
                            <li><ScrollLink to="pricing" smooth={true} duration={500} offset={-80} className="hover:text-primary cursor-pointer transition-colors font-medium">Pricing</ScrollLink></li>
                            <li><ScrollLink to="portfolio" smooth={true} duration={500} offset={-80} className="hover:text-primary cursor-pointer transition-colors font-medium">Portfolio</ScrollLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li><RouterLink to="/faq" className="hover:text-primary transition-colors font-medium">FAQs</RouterLink></li>
                            <li><RouterLink to="/privacy" className="hover:text-primary transition-colors font-medium">Privacy Policy</RouterLink></li>
                            <li><RouterLink to="/terms" className="hover:text-primary transition-colors font-medium">Terms of Service</RouterLink></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center pt-8 border-t border-white/5 text-gray-500 text-sm">
                    © {new Date().getFullYear()} WebsiteLelo. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
