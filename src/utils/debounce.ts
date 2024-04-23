function debounce<T extends (...args: any[]) => any>(callback: T, wait: number): T {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
    return function(...args: Parameters<T>): ReturnType<T> {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => callback(...args), wait);
  
      return undefined as unknown as ReturnType<T>;
    } as T;
  }

export default debounce;
