import React, {
  useState,
  useEffect,
  ChangeEvent,
  useRef,
  useCallback,
} from "react";
import "./styles.css";
import debounce from "../utils/debounce.ts";
import { Product } from "./types";



const Autocomplete: React.FC = () => {
  const [input, setInput] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debounceFetchProducts = useCallback(
    debounce((input: string) => fetchProducts(input), 500),
    []
  );

  const fetchProducts = async (input: string) => {
    if (!input) return;
    setLoading(true);
    try {
      const apiResponse = await fetch(
        `https://dummyjson.com/products/search?q=${input}`
      );
      const data = await apiResponse.json();
      setProducts(data.products);
      setIsDropdownVisible(true);
    } catch (error) {
      setError("Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (input) {
      debounceFetchProducts(input);
    }
  }, [input, debounceFetchProducts]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSelect = (title: string) => {
    setInput(title);
    setProducts([]);
    setIsDropdownVisible(false);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setIsDropdownVisible(false);
      }
    }, 100);
  };

  const renderHighlightedText = (text: string) => {
    const parts = text.split(new RegExp(`(${input})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === input.toLowerCase() ? (
        <b key={index}>{part}</b>
      ) : (
        part
      )
    );
  };

  return (
    <div className="autocomplete">
      <input
        ref={inputRef}
        type="text"
        onChange={handleChange}
        onBlur={handleBlur}
        value={input}
        className="autocomplete-input"
      />
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {isDropdownVisible && products.length > 0 && (
        <ul className="suggestions-list">
          {products.map((product, index) => (
            <li key={product.id} onClick={() => handleSelect(product.title)}>
              {renderHighlightedText(product.title)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
