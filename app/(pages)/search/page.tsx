import SearchInput from "@/modules/search/ui/components/search-input";
import SearchContent from "@/modules/search/ui/components/search-content";
import getSongsByTitle from "@/actions/getSongsByTitle";

interface Props {
  searchParams?: {
    title?: string;
  };
}
const SearchPage = async ({ searchParams }: Props) => {
  const songs = await getSongsByTitle(searchParams?.title ?? "");
  console.log("searchParams received:", searchParams);
  return (
    <div className="flex h-full w-full flex-col justify-start bg-neutral-900 rounded-lg items-center gap-2">
      <SearchInput />
      <SearchContent songs={songs} />
    </div>
  );
};

export default SearchPage;
