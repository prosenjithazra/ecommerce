"use client";

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, EyeOff, X, ArrowLeft, ArrowRight, Star, AlertTriangle, ChevronDown, Check, ChevronLeft, Search } from 'lucide-react';

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
      <Link href={actionHref} className="mt-6 bg-[#df794d] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#df794d]/25">
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
      <div className="absolute inset-0 border-4 border-t-[#df794d] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
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
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setSearchQuery("");
        }}
        className="w-full flex items-center justify-between border border-[#E8E2D6] dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg py-2 px-3.5 text-xs font-semibold text-[#4A453E] dark:text-zinc-200 outline-none focus:outline-none focus:ring-0 focus:border-[#E8E2D6] dark:focus:border-zinc-700 hover:border-[#E8E2D6] dark:hover:border-zinc-700 transition-all text-left"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown className={`w-4 h-4 text-[#A89B8A] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full min-w-[10rem] mt-1.5 bg-white dark:bg-zinc-900 border border-[#E8E2D6] dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden animate-fade-in-up duration-150">
          {/* Autocomplete Search Header */}
          <div className="p-1.5 border-b border-[#E8E2D6]/60 dark:border-zinc-800 bg-[#FDFAF6] dark:bg-zinc-900/90 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 outline-none focus:outline-none focus:ring-0"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Options List */}
          <div className="p-1 space-y-0.5 max-h-[180px] overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={`w-full flex items-center justify-between rounded-lg py-2 px-3 text-xs text-left transition-colors ${
                      isSelected
                        ? "bg-[#FBD5C1]/30 text-[#E8855A] font-extrabold"
                        : "text-[#7A736A] dark:text-zinc-300 hover:bg-[#FDFAF6] dark:hover:bg-zinc-800 hover:text-[#4A453E] dark:hover:text-white font-medium"
                    }`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E8855A]" />}
                  </button>
                );
              })
            ) : (
              <div className="py-3 px-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
                No matching results
              </div>
            )}
          </div>
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
  const [visibleCols, setVisibleCols] = React.useState(1);
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftState, setScrollLeftState] = React.useState(0);
  const [hasDragged, setHasDragged] = React.useState(false);

  const childrenArray = React.Children.toArray(children);
  const isMobileSlider1Point5 = childrenArray.length > 2;
  const isTabSlider = childrenArray.length > 3;
  const isDesktopSlider = childrenArray.length > desktopCols;

  const updateVisibleCols = React.useCallback(() => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    if (width >= 992) {
      setVisibleCols(isDesktopSlider ? (desktopCols || 4) : Math.min(childrenArray.length, desktopCols || 4));
    } else if (width >= 768) {
      setVisibleCols(2);
    } else {
      setVisibleCols(1);
    }
  }, [childrenArray.length, desktopCols, isDesktopSlider]);

  const numDots = React.useMemo(() => {
    if (childrenArray.length <= 1) return 0;
    return Math.max(1, Math.ceil(childrenArray.length / (visibleCols || 1)));
  }, [childrenArray.length, visibleCols]);

  const updateScrollState = React.useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
      
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0 || numDots <= 1) {
        setActiveIndex(0);
        return;
      }
      const progress = Math.min(1, Math.max(0, scrollLeft / maxScroll));
      const idx = Math.min(Math.round(progress * (numDots - 1)), numDots - 1);
      setActiveIndex(idx);
    }
  }, [numDots]);

  React.useEffect(() => {
    updateVisibleCols();
    updateScrollState();
    const handleResize = () => {
      updateVisibleCols();
      updateScrollState();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateVisibleCols, updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDotClick = (dotIdx: number) => {
    if (!scrollRef.current) return;
    const targetItemIdx = Math.min(dotIdx * visibleCols, childrenArray.length - 1);
    const child = scrollRef.current.children[targetItemIdx] as HTMLElement;
    if (child) {
      const targetLeft = child.offsetLeft - scrollRef.current.offsetLeft;
      scrollRef.current.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 4) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Mobile (<= 767px / < md): 82% width per card for 1.5 slider view
  const mobileWidthClass = childrenArray.length > 1 ? 'w-[82%] min-w-[82%]' : 'w-full min-w-full';

  // Tab (768px to 991px / md:): 2 items per view in slider mode, or w-full in grid mode
  const tabWidthClass = isTabSlider
    ? 'md:w-[calc(50%-10px)] md:min-w-[calc(50%-10px)]'
    : 'md:w-full md:min-w-0';

  // Desktop (>= 992px / lg:): 3 or 4 items per view in slider mode, or w-full in grid mode
  let desktopWidthClass = '';
  if (isDesktopSlider) {
    desktopWidthClass = desktopCols === 3
      ? 'lg:w-[calc(33.333%-14px)] lg:min-w-[calc(33.333%-14px)]'
      : 'lg:w-[calc(25%-15px)] lg:min-w-[calc(25%-15px)]';
  } else {
    desktopWidthClass = 'lg:w-full lg:min-w-0 lg:max-w-none';
  }

  const itemWidthClass = `${mobileWidthClass} ${tabWidthClass} ${desktopWidthClass}`;

  const baseContainerClass = 'flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 no-scrollbar select-none cursor-grab active:cursor-grabbing transition-all duration-300';

  let containerClass = baseContainerClass;
  if (!isTabSlider && !isDesktopSlider) {
    // <= 3 items: grid on tab (3 cols at md: 768px) & grid on desktop
    containerClass += ` md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:select-auto md:cursor-auto lg:grid-cols-${desktopCols}`;
  } else if (!isDesktopSlider) {
    // 4 items (desktopCols=4): slider on tab (> 3 items), grid on desktop (4 cols)
    containerClass += ` lg:grid lg:grid-cols-${desktopCols} lg:gap-5 lg:overflow-visible lg:pb-0 lg:select-auto lg:cursor-auto`;
  }

  // Dynamic CSS Mask for smooth edge fade on scroll
  const maskStyle = React.useMemo(() => {
    if (canScrollLeft && canScrollRight) {
      return {
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
      };
    }
    if (canScrollLeft) {
      return {
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 100%)',
      };
    }
    if (canScrollRight) {
      return {
        WebkitMaskImage: 'linear-gradient(to right, black 0%, black 96%, transparent 100%)',
        maskImage: 'linear-gradient(to right, black 0%, black 96%, transparent 100%)',
      };
    }
    return {};
  }, [canScrollLeft, canScrollRight]);

  return (
    <div className="relative group/slider w-full">

      {/* Scrollable & Draggable Container with Smooth Edge Fade */}
      <div
        ref={scrollRef}
        style={maskStyle}
        onScroll={updateScrollState}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onClickCapture={handleClickCapture}
        className={containerClass}
      >
        {childrenArray.map((child, idx) => (
          <div key={idx} className={`${itemWidthClass} snap-start flex-shrink-0 flex [&>*]:w-full [&>*]:h-full transition-all duration-500 ease-out`}>
            {child}
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      {numDots > 1 && (
        <div className={`flex justify-center gap-1.5 mt-3 ${
          isDesktopSlider ? '' : isTabSlider ? 'lg:hidden' : 'md:hidden'
        }`}>
          {Array.from({ length: numDots }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === idx ? 'bg-[#df794d] w-4' : 'bg-[#E8E2D6] w-1.5 hover:bg-[#A89B8A]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

