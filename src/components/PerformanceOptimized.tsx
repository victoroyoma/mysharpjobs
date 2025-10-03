import React, { memo, useCallback, useMemo, useState, useEffect, useRef } from 'react';
import { usePerformanceTracking } from '../utils/performanceMonitor';

// High-order component for performance optimization
export function withPerformanceOptimization<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string,
  options: {
    memoize?: boolean;
    trackPerformance?: boolean;
    lazyRender?: boolean;
    virtualizeThreshold?: number;
  } = {}
) {
  const {
    memoize = true,
    trackPerformance = true,
    lazyRender = false,
    virtualizeThreshold = 100
  } = options;

  const OptimizedComponent = (props: T) => {
    const { renderCount } = trackPerformance ? usePerformanceTracking(componentName) : { renderCount: 0 };
    const [isVisible, setIsVisible] = useState(!lazyRender);
    const elementRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy rendering
    useEffect(() => {
      if (!lazyRender || isVisible) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => observer.disconnect();
    }, [lazyRender, isVisible]);

    // Virtual rendering for large lists
    const shouldVirtualize = useMemo(() => {
      if (Array.isArray((props as any).items)) {
        return (props as any).items.length > virtualizeThreshold;
      }
      return false;
    }, [(props as any).items, virtualizeThreshold]);

    if (lazyRender && !isVisible) {
      return (
        <div 
          ref={elementRef} 
          style={{ height: '200px', background: '#f5f5f5' }}
          className="flex items-center justify-center text-gray-500"
        >
          Loading {componentName}...
        </div>
      );
    }

    return (
      <div ref={elementRef} data-component={componentName} data-renders={renderCount}>
        <Component {...props} />
      </div>
    );
  };

  OptimizedComponent.displayName = `Optimized(${componentName})`;

  return memoize ? memo(OptimizedComponent) : OptimizedComponent;
}

// Optimized list component for large datasets
export const VirtualizedList = memo(function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
  className = ""
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight?: number;
  containerHeight?: number;
  overscan?: number;
  className?: string;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { startIndex, endIndex };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.startIndex + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Debounced input component
export const DebouncedInput = memo(function DebouncedInput({
  value,
  onChange,
  delay = 300,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback((newValue: string) => {
    setLocalValue(newValue);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, delay);
  }, [onChange, delay]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <input
      {...props}
      value={localValue}
      onChange={(e) => debouncedOnChange(e.target.value)}
    />
  );
});

// Optimized image component with lazy loading
export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  placeholder = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 200"><rect fill="%23f0f0f0" width="300" height="200"/></svg>',
  className = "",
  ...props
}: {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'>) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <img
      ref={imgRef}
      src={isInView ? src : placeholder}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'} ${className}`}
      onLoad={handleLoad}
      loading="lazy"
      {...props}
    />
  );
});

// Error boundary component
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 Error caught by boundary:', error, errorInfo);
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
      <div className="text-red-500 text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
      <p className="text-gray-600 mb-4">
        We encountered an unexpected error. Please try refreshing the page.
      </p>
      <details className="text-left bg-gray-100 p-4 rounded text-sm text-gray-700 mb-4">
        <summary className="cursor-pointer font-medium">Error details</summary>
        <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
      </details>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

// Performance-aware component wrapper
export function withPerformanceWrapper<T extends object>(
  Component: React.ComponentType<T>,
  displayName: string
) {
  const WrappedComponent = (props: T) => {
    const startTime = useRef(performance.now());
    
    useEffect(() => {
      const endTime = performance.now();
      const renderTime = endTime - startTime.current;
      
      if (renderTime > 16) { // More than one frame (60fps)
        console.warn(`⚠️ Slow render detected in ${displayName}: ${renderTime.toFixed(2)}ms`);
      }
    });

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `PerformanceWrapper(${displayName})`;
  return memo(WrappedComponent);
}
