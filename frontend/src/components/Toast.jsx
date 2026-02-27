import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-8 right-8 z-[100]"
                >
                    <div className={`flex items-center space-x-4 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                            {type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <p className="font-semibold text-sm">{type === 'success' ? 'Success' : 'Error'}</p>
                            <p className="text-sm opacity-80">{message}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/5 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
