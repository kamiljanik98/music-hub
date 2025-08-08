import SearchInput from "@/modules/search/ui/components/search-input";
import SearchContent from "@/modules/search/ui/components/search-content";
import getSongsByTitle from "@/actions/getSongsByTitle";

interface Props {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
export const revalidate = 0;

const SearchPage = async ({ searchParams }: Props) => {
  const resolvedSearchParams = await searchParams;
  const title = (resolvedSearchParams?.title as string) || "";

  const songs = await getSongsByTitle(title);
  return (
    <div className="flex h-full w-full flex-col justify-start bg-neutral-900 rounded-lg items-center gap-2">
      <SearchInput />
      <SearchContent songs={songs} />
    </div>
  );
};

export default SearchPage;
