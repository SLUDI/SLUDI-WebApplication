import { Input } from "antd";
import PropTypes from "prop-types";
import { useRef } from "react";

const SearchInput = ({
  size = "middle",
  placeholder = "Search...",
  suffixIcon: SuffixIcon = null,
  maxLength = 100,
  onSearch = () => {},
  onPasteSearch = () => {},
  debounceTime = 1000,
  ...props
}) => {
  const debounceTimeout = useRef(null);
  //on key down
  const handleKeyDown = (e) => {
    const key = e.key;
    const value = e.target.value;
    if (key === " " && value.length === 0) {
      e.preventDefault();
    }

    if (key === " " && value.endsWith(" ")) {
      e.preventDefault();
    }

    const restrictedCharacters = /[,[\]{}]/;
    if (restrictedCharacters.test(key)) {
      e.preventDefault();
    }
  };

  //on paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");

    const cleanedText = pastedText
      .replace(/[,[\]{}]/g, "")
      .replace(/\s{2,}/g, " ")
      .trim();

    document.execCommand("insertText", false, cleanedText);
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      onPasteSearch(cleanedText);
    }, debounceTime);
  };

  //handle search text and function
  const handleKeyUp = (e) => {
    const key = e.key;
    const value = e.target.value.trim();
    clearTimeout(debounceTimeout.current); // Clear the previous timeout
    if (key === " " && value.length === 0) {
      e.preventDefault();
    } else {
      debounceTimeout.current = setTimeout(() => {
        console.log("onSearch", value);
        onSearch(value);
      }, debounceTime);
    }
  };

  return (
    <Input
      size={size}
      placeholder={placeholder}
      {...props}
      maxLength={maxLength}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onKeyUp={handleKeyUp}
      suffix={
        SuffixIcon && (
          <div className="flex items-center justify-end gap-2">
            <SuffixIcon className="w-[20px]" />
          </div>
        )
      }
    />
  );
};
SearchInput.propTypes = {
  size: PropTypes.oneOf(["small", "middle", "large"]),
  placeholder: PropTypes.string,
  suffixIcon: PropTypes.elementType,
  maxLength: PropTypes.number,
  onSearch: PropTypes.func,
  onPasteSearch: PropTypes.func,
  debounceTime: PropTypes.number,
};
export default SearchInput;

//how to apply

{
  /* <SearchInput
  size="middle"
  placeholder="Search for business page"
  className="w-full h-full max-w-md rounded-full"
  suffixIcon={SearchIcon}
  maxLength={100}
  onSearch={(searchValue) => {
    setMoreLoading(true);
    setPosts([]);
    setNewRequestedFilters({
      page: 1,
      search: searchValue,
    });
  }}
  onPasteSearch={(pastedValue) => {
    setMoreLoading(true);
    setPosts([]);
    setNewRequestedFilters({
      page: 1,
      search: pastedValue,
    });
  }}
/>; */
}
