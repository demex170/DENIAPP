import React from 'react';
import { Clock } from 'lucide-react';
import { TimelineItem, DressCode as DressCodeType } from '../../types/index.ts';

interface TimelineViewProps {
  items: TimelineItem[];
  theme?: 'light' | 'dark';
}

export const TimelineView: React.FC<TimelineViewProps> = ({ items, theme = 'light' }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-[11px] sm:before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-stone-200">
      {items.map((item, index) => (
        <div key={item.id || index} className="relative group text-left">
          {/* Dot */}
          <div className="absolute -left-6 sm:-left-8 top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-amber-800 transition-transform group-hover:scale-125" />

          <div className="bg-white/90 p-4 rounded-xl border border-stone-200/80 shadow-xs hover:border-amber-800/40 transition-colors">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 tracking-wide uppercase">
              <Clock className="w-3.5 h-3.5" />
              <span>{item.time}</span>
            </div>
            <h4 className="text-sm sm:text-base font-semibold text-stone-900 mt-1">
              {item.title}
            </h4>
            {item.description && (
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

interface DressCodeCardProps {
  dressCode: DressCodeType;
}

export const DressCodeCard: React.FC<DressCodeCardProps> = ({ dressCode }) => {
  if (!dressCode) return null;

  return (
    <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-xs text-center space-y-4 max-w-md mx-auto">
      <div>
        <span className="text-[11px] uppercase tracking-widest text-amber-800 font-semibold">
          დრეს კოდი
        </span>
        <h3 className="text-lg font-serif-ka font-semibold text-stone-900 mt-0.5">
          {dressCode.type}
        </h3>
      </div>

      {dressCode.description && (
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          {dressCode.description}
        </p>
      )}

      {dressCode.palette && dressCode.palette.length > 0 && (
        <div className="pt-2">
          <p className="text-[11px] text-stone-400 mb-2">რეკომენდებული ფერები:</p>
          <div className="flex items-center justify-center gap-2">
            {dressCode.palette.map((color, idx) => (
              <span
                key={idx}
                className="w-6 h-6 rounded-full border border-stone-200 shadow-xs transition-transform hover:scale-110"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
