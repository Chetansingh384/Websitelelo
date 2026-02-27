import React from 'react';
import CountUp from './CountUp';
import { Users, Briefcase, Award, Clock } from 'lucide-react';

const stats = [
    {
        icon: <Users className="w-6 h-6" />,
        label: 'Happy Clients',
        value: 45,
        suffix: '+'
    },
    {
        icon: <Briefcase className="w-6 h-6" />,
        label: 'Websites Built',
        value: 50,
        suffix: '+'
    },
    {
        icon: <Clock className="w-6 h-6" />,
        label: 'Years Experience',
        value: 4,
        suffix: '+'
    }
];

const Stats = () => {
    return (
        <section className="py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                                <CountUp
                                    from={0}
                                    to={stat.value}
                                    duration={2}
                                    className="count-up-text"
                                />
                                {stat.suffix}
                            </div>
                            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
