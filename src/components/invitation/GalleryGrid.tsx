import React, { useState } from 'react';
import { ChevronDown, Image as ImageIcon } from 'lucide-react';
import { FAQItem, GalleryItem } from '../../types/index.ts';
import { Modal } from '../ui/Modal.tsx';

interface FAQAccordionProps {
  faqs: FAQItem[];
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="space-y-2.5 max-w-xl mx-auto w-full text-left">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={faq.id || index}
            className="rounded-xl border border-stone-200 bg-white overflow-hidden transition-colors"
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-stone-50 transition-colors"
            >
              <span className="text-sm font-medium text-stone-900">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-stone-400 transition-transform duration-200 shrink-0 ${
                  isOpen ? 'rotate-180 text-amber-800' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-stone-50/40">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

interface GalleryGridProps {
  items: GalleryItem[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items }) => {
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 max-w-3xl mx-auto">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            onClick={() => setActivePhoto(item)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 cursor-pointer shadow-xs hover:shadow-md transition-all"
          >
            <img
              src={item.url}
              alt={item.caption || 'ფოტო'}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate font-medium">
                  {item.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={!!activePhoto}
        onClose={() => setActivePhoto(null)}
        title={activePhoto?.caption || 'ფოტოგალერეა'}
        maxWidth="3xl"
      >
        {activePhoto && (
          <div className="flex flex-col items-center">
            <div className="rounded-xl overflow-hidden bg-black max-h-[70vh] flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || 'დიდი ფოტო'}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto object-contain"
              />
            </div>
            {activePhoto.caption && (
              <p className="text-sm text-stone-700 mt-3 text-center">
                {activePhoto.caption}
              </p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
