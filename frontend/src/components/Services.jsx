import React from 'react';
import { ShoppingCart, Layout, Briefcase, Code } from 'lucide-react';

const services = [
    {
        icon: <Briefcase className="text-blue-500" size={32} />,
        title: 'Business Websites',
        description: 'Professional presence for established companies and startups.'
    },
    {
        icon: <ShoppingCart className="text-green-500" size={32} />,
        title: 'E-Commerce',
        description: 'Robust online stores for small shops and large retailers.'
    },
    {
        icon: <Layout className="text-purple-500" size={32} />,
        title: 'Portfolios',
        description: 'Personalized showcase for creators, artists, and freelancers.'
    },
    {
        icon: <Code className="text-orange-500" size={32} />,
        title: 'Custom Solutions',
        description: 'Tailor-made web applications for specific business needs.'
    }
];

const Services = () => {
    return (
        <section id="services" className="py-24 bg-dark/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Our Services</h2>
                    <p className="text-slate-600 dark:text-gray-400">Everything you need to grow your business online</p>
                </div>
                <div className="grid md:grid-cols-4 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="glass-card flex flex-col items-center text-center group cursor-default">
                            <div className="mb-6 p-4 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                            <p className="text-slate-500 dark:text-gray-400 text-sm">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Services;
