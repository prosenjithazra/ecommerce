"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, EyeOff, X, ArrowLeft, ArrowRight, Star, AlertTriangle, ChevronDown, Check, ChevronLeft } from 'lucide-react';

/* 1. BREADCRUMB */
interface BreadcrumbItem { name: string; href?: string; }
export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => (
  <nav className="flex items-center gap-1.5 text-xs text-[#A89B8A] pt-6 sm:pt-8 sm:pt-10 pb-2 sm:pb-4 overflow-x-auto whitespace-nowrap">
    <Link href="/" className="hover:text-[#4A453E] flex items-center gap-1 transition-colors">
      <Home className="w-4.5 h-4.5" />
    </Link>
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <ChevronRight className="w-4 h-4 flex-shrink-0" />
        {item.href ? (
          <Link href={item.href} className="hover:text-[#4A453E] transition-colors font-medium">{item.name}</Link>
        ) : (
          <span className="text-[#4A453E] font-semibold text-sm truncate">{item.name}</span>
        )}
      </React.Fragment>
    ))}
  </nav>
);

/* 2. PAGINATION */
interface PaginationProps { currentPage: number; totalPages: number; onPageChange: (page: number) => void; }
export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-2 mt-8 py-4">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="p-2 border border-[#E8E2D6] rounded-lg hover:bg-[#E8E2D6] disabled:opacity-40 transition-colors text-[#7A736A]">
        <ArrowLeft className="w-4 h-4" />
      </button>
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)}
          className={`w-9 h-9 rounded-lg text-xs font-bold transition-all border ${
            currentPage === page
              ? 'bg-[#4A453E] border-[#4A453E] text-white'
              : 'bg-transparent border-[#E8E2D6] text-[#7A736A] hover:border-[#A89B8A]'
          }`}>{page}</button>
      ))}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="p-2 border border-[#E8E2D6] rounded-lg hover:bg-[#E8E2D6] disabled:opacity-40 transition-colors text-[#7A736A]">
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

/* 3. EMPTY STATE */
interface EmptyStateProps { title: string; description: string; actionText?: string; actionHref?: string; icon?: React.ReactNode; }
export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionText, actionHref, icon }) => (
  <div className="w-full flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 py-14 animate-fade-in-up">
    <div className="w-16 h-16 bg-[#FBD5C1]/40 text-[#E8855A] rounded-full flex items-center justify-center mb-5 animate-subtle-bounce">
      {icon || <EyeOff className="w-8 h-8" />}
    </div>
    <h3 className="font-extrabold text-lg text-[#4A453E] dark:text-white tracking-tight">{title}</h3>
    <p className="text-xs text-[#7A736A] dark:text-zinc-400 max-w-sm mt-2 leading-relaxed">{description}</p>
    {actionText && actionHref && (
      <Link href={actionHref} className="mt-6 bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25">
        {actionText}
      </Link>
    )}
  </div>
);

/* 4. SKELETON LOADER */
export const SkeletonLoader: React.FC<{ type?: 'card' | 'list' | 'detail' }> = ({ type = 'card' }) => {
  if (type === 'list') {
    return (
      <div className="space-y-4 w-full">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border border-[#E8E2D6] rounded-lg animate-pulse">
            <div className="w-16 h-16 bg-[#E8E2D6] rounded-lg" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-[#E8E2D6] rounded w-3/4" />
              <div className="h-3 bg-[#E8E2D6] rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (type === 'detail') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse w-full max-w-5xl mx-auto py-8">
        <div className="aspect-square bg-[#E8E2D6] rounded-lg" />
        <div className="space-y-6 py-4">
          <div className="h-8 bg-[#E8E2D6] rounded w-3/4" />
          <div className="h-5 bg-[#E8E2D6] rounded w-1/4" />
          <div className="space-y-2">
            <div className="h-4 bg-[#E8E2D6] rounded w-full" />
            <div className="h-4 bg-[#E8E2D6] rounded w-full" />
            <div className="h-4 bg-[#E8E2D6] rounded w-5/6" />
          </div>
          <div className="h-12 bg-[#E8E2D6] rounded-lg w-full mt-8" />
        </div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="border border-[#E8E2D6] rounded-lg p-4 space-y-4 animate-pulse">
          <div className="aspect-square bg-[#E8E2D6] rounded-lg w-full" />
          <div className="h-4 bg-[#E8E2D6] rounded w-3/4" />
          <div className="h-3 bg-[#E8E2D6] rounded w-1/2" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-5 bg-[#E8E2D6] rounded w-1/3" />
            <div className="h-4 bg-[#E8E2D6] rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

/* 5. RATING */
export const Rating: React.FC<{ value: number; size?: number }> = ({ value, size = 4 }) => (
  <div className="flex text-amber-400 gap-0.5">
    {[...Array(5)].map((_, i) => (
      <Star key={i}
        className={`fill-current ${size === 3 ? 'w-3 h-3' : 'w-4 h-4'}`}
        style={{ color: i < Math.floor(value) ? 'currentColor' : '#E8E2D6' }}
      />
    ))}
  </div>
);

/* 6. PRICE */
export const Price: React.FC<{ value: number; original?: number; size?: 'sm' | 'md' | 'lg' }> = ({ value, original, size = 'md' }) => (
  <div className="flex items-baseline gap-1.5">
    <span className={`font-extrabold text-[#4A453E] ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-base'}`}>
      ₹{value.toFixed(2)}
    </span>
    {original && original > value && (
      <span className={`text-[#A89B8A] line-through ${size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-sm' : 'text-xs'}`}>
        ₹{original.toFixed(2)}
      </span>
    )}
  </div>
);

/* 7. STATUS BADGE */
export const StatusBadge: React.FC<{ status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Success' | 'Refunded' | 'Returned' }> = ({ status }) => {
  const getColors = () => {
    switch (status) {
      case 'Delivered': case 'Success':   return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': case 'Refunded':  return 'bg-rose-50 text-rose-600 border-rose-200';
      case 'Shipped':                     return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Processing':                  return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Returned':                    return 'bg-violet-50 text-violet-700 border-violet-200';
      default:                            return 'bg-[#E8E2D6] text-[#7A736A] border-[#D4CCC0]';
    }
  };
  return <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${getColors()}`}>{status}</span>;
};

/* 8. DRAWER */
interface DrawerProps { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; }
export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-start !m-0">
      <div className="fixed inset-0 bg-black/40 animate-fade-in-overlay" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-from-left">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D6]">
          <h3 className="font-bold text-base text-[#4A453E]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-[#E8E2D6] text-[#7A736A] hover:text-[#4A453E]">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
};

/* 9. CONFIRM DIALOG */
interface ConfirmDialogProps {
  isOpen: boolean; onClose: () => void; onConfirm: () => void;
  title: string; description: string; confirmText?: string; cancelText?: string;
}
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", cancelText = "Cancel"
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white border border-[#E8E2D6] rounded-lg p-6 shadow-2xl max-w-sm w-full z-10 animate-fade-in-up">
        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="font-extrabold text-base text-[#4A453E]">{title}</h4>
        <p className="text-xs text-[#7A736A] mt-2 leading-relaxed">{description}</p>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 border border-[#E8E2D6] text-[#7A736A] py-2.5 rounded-lg font-bold text-xs hover:bg-[#E8E2D6] transition-colors">
            {cancelText}
          </button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-bold text-xs transition-colors">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* 10. LOADING SPINNER */
export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 border-4 border-[#E8E2D6] rounded-full" />
      <div className="absolute inset-0 border-4 border-t-[#F9A37E] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
    </div>
  </div>
);

/* 11. SELECT (Shadcn style) */
export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, placeholder = "Select...", className = "" }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-[#E8E2D6] bg-white rounded-lg py-2 px-3.5 text-xs font-semibold text-[#4A453E] outline-none shadow-sm focus:border-[#F9A37E] transition-all text-left"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-[#A89B8A] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full min-w-[8rem] mt-1.5 bg-white border border-[#E8E2D6] rounded-lg shadow-lg p-1 space-y-0.5 animate-fade-in-up duration-150">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between rounded-lg py-2 px-3 text-xs text-left transition-colors ${
                  isSelected
                    ? "bg-[#FBD5C1]/30 text-[#E8855A] font-extrabold"
                    : "text-[#7A736A] hover:bg-[#FDFAF6] hover:text-[#4A453E] font-medium"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#E8855A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* 12. RESPONSIVE SLIDER (Shadcn/Swiper style) */
interface SliderProps {
  children: React.ReactNode;
  desktopCols?: 3 | 4;
}

export const Slider: React.FC<SliderProps> = ({ children, desktopCols = 4 }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const childrenArray = React.Children.toArray(children);

  const updateScrollState = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      const index = Math.round(scrollLeft / (clientWidth * 0.666));
      setActiveIndex(Math.min(index, childrenArray.length - 1));
    }
  }, [childrenArray.length]);

  React.useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const itemWidthClass = desktopCols === 3
    ? 'w-full sm:w-[48%] md:w-[calc(33.333%-14px)] min-w-full sm:min-w-[48%] md:min-w-[calc(33.333%-14px)]'
    : 'w-full sm:w-[48%] lg:w-[calc(25%-15px)] min-w-full sm:min-w-[48%] lg:min-w-[calc(25%-15px)]';

  return (
    <div className="relative group/slider w-full">
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => scroll('left')}
          className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#4A453E] shadow-md border border-[#E8E2D6] hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 flex items-center justify-center cursor-pointer"
          aria-label="Previous items"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => scroll('right')}
          className="absolute -right-3.5 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-white/95 hover:bg-white text-[#4A453E] shadow-md border border-[#E8E2D6] hover:scale-110 transition-all opacity-0 group-hover/slider:opacity-100 flex items-center justify-center cursor-pointer"
          aria-label="Next items"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar scroll-smooth"
      >
        {childrenArray.map((child, idx) => (
          <div key={idx} className={`${itemWidthClass} snap-start flex-shrink-0 flex [&>*]:w-full [&>*]:h-full`}>
            {child}
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {childrenArray.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {Array.from({ length: childrenArray.length }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (scrollRef.current) {
                  const child = scrollRef.current.children[idx] as HTMLElement;
                  if (child) {
                    child.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                  }
                }
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx ? 'bg-[#F9A37E] w-4' : 'bg-[#E8E2D6] w-1.5'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

