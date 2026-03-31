import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';

interface AppModalProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClassName?: string;
  bodyClassName?: string;
}

export function AppModal({
  title,
  description,
  icon,
  onClose,
  children,
  maxWidthClassName = 'max-w-xl',
  bodyClassName = 'p-5',
}: AppModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-zinc-900/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        className={`bg-white w-full ${maxWidthClassName} rounded-[28px] shadow-2xl border border-zinc-100 overflow-hidden flex flex-col max-h-[88vh]`}
      >
        <div className="px-5 py-4 border-b border-zinc-100 flex items-start justify-between gap-4 bg-zinc-50/80">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 flex-shrink-0">
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-2xl leading-none font-black text-zinc-900">{title}</h2>
              {description && <p className="text-sm text-zinc-500 mt-1.5">{description}</p>}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-700 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className={`flex-1 overflow-y-auto custom-scrollbar ${bodyClassName}`}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
