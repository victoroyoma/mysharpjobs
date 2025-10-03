import { useEffect, useState } from 'react';

// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private renderCounts: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track component mount time
  trackComponentMount(componentName: string) {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      this.metrics.set(`${componentName}_mount`, duration);
      console.log(`⚡ ${componentName} mounted in ${duration.toFixed(2)}ms`);
    };
  }

  // Track render count
  trackRender(componentName: string) {
    const count = this.renderCounts.get(componentName) || 0;
    this.renderCounts.set(componentName, count + 1);
  }

  // Get performance metrics
  getMetrics() {
    return {
      metrics: Object.fromEntries(this.metrics),
      renderCounts: Object.fromEntries(this.renderCounts)
    };
  }

  // Log performance summary
  logSummary() {
    console.group('🚀 Performance Summary');
    console.table(this.getMetrics().metrics);
    console.table(this.getMetrics().renderCounts);
    console.groupEnd();
  }
}

// Hook for component performance tracking
export function usePerformanceTracking(componentName: string) {
  const [renderCount, setRenderCount] = useState(0);
  const monitor = PerformanceMonitor.getInstance();

  useEffect(() => {
    const stopTracking = monitor.trackComponentMount(componentName);
    return stopTracking;
  }, [componentName, monitor]);

  useEffect(() => {
    monitor.trackRender(componentName);
    setRenderCount(prev => prev + 1);
  });

  return { renderCount };
}

// Bundle size analyzer (for development)
export const bundleAnalyzer = {
  // Track chunk loading
  trackChunkLoad: (chunkName: string) => {
    const startTime = performance.now();
    return () => {
      const endTime = performance.now();
      console.log(`📦 Chunk "${chunkName}" loaded in ${(endTime - startTime).toFixed(2)}ms`);
    };
  },

  // Estimate component size impact
  estimateComponentSize: (componentName: string, element: HTMLElement | null) => {
    if (!element) return;
    
    const rect = element.getBoundingClientRect();
    const estimatedNodes = element.querySelectorAll('*').length;
    
    console.log(`📊 ${componentName} stats:`, {
      dimensions: `${rect.width}x${rect.height}px`,
      domNodes: estimatedNodes,
      complexity: estimatedNodes > 100 ? 'High' : estimatedNodes > 50 ? 'Medium' : 'Low'
    });
  }
};

// Memory usage monitor
export const memoryMonitor = {
  // Check memory usage (if available)
  checkMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      console.log('💾 Memory Usage:', {
        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`
      });
    }
  },

  // Monitor for memory leaks
  startMemoryWatch: () => {
    setInterval(() => {
      memoryMonitor.checkMemoryUsage();
    }, 30000); // Check every 30 seconds
  }
};

// Network performance tracker
export const networkMonitor = {
  // Track API call performance
  trackAPICall: (url: string, method: string = 'GET') => {
    const startTime = performance.now();
    
    return {
      onSuccess: (response?: any) => {
        const endTime = performance.now();
        console.log(`🌐 API ${method} ${url} succeeded in ${(endTime - startTime).toFixed(2)}ms`);
      },
      onError: (error?: any) => {
        const endTime = performance.now();
        console.error(`❌ API ${method} ${url} failed in ${(endTime - startTime).toFixed(2)}ms`, error);
      }
    };
  },

  // Track resource loading
  trackResourceLoad: (resourceType: string, url: string) => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes(url)) {
          console.log(`📄 ${resourceType} loaded: ${url} (${entry.duration.toFixed(2)}ms)`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
};

// Development-only performance tracking
export const devPerformance = {
  init: () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Performance monitoring enabled');
      
      // Start memory monitoring
      memoryMonitor.startMemoryWatch();
      
      // Log initial metrics
      setTimeout(() => {
        PerformanceMonitor.getInstance().logSummary();
      }, 5000);

      // Track largest contentful paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log(`🎨 Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Track cumulative layout shift
      new PerformanceObserver((list) => {
        let cls = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
        console.log(`📐 Cumulative Layout Shift: ${cls.toFixed(4)}`);
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }
};
