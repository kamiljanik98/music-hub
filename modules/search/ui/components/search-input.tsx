"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import qs from "query-string";
import Input from "@/components/common/Input";
import { FaSearch } from "react-icons/fa";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debounceValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = {
      title: debounceValue,
    };

    const url = qs.stringifyUrl({
      url: "/search",
      query: query,
    });

    router.push(url);
  }, [debounceValue, router]);

  return (
    <div className="p-4 w-full border-b border-neutral-800 text-start">
      <div className=" flex gap-2 items-center ">
        <Input
          icon={<FaSearch className="text-neutral-500" size={16} />}
          placeholder="What do you want to listen today?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <p className="text-xs text-neutral-500 pt-4">
        <strong className="text-yellow-600">Note:</strong> You can search by tags, genre and scale
      </p>
    </div>
  );
};

export default SearchInput;
