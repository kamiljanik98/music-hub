"use client";

import Input from "@/components/Input";
import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <Input
      icon={<FaSearch size={18} />}
      placeholder="Search the songs database..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default SearchInput;
