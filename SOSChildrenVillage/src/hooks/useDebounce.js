import { useState, useEffect } from "react";

// Code này la dùng để thực hiện việc tìm kiếm or xử lý input của Search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
    
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;