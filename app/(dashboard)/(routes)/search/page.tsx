import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Categories } from "./_components/categories";
import { SearchInput } from "@/components/search-input";



const SearchPage = async () => {
 

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });


  return (
    <>
       <div className="px-6 pt-6 md:hidden md:md-0 block">
    <SearchInput />
  </div>
  <div className="p-6 ">
  <Categories items={categories} />
</div>
    </>
   
  );
};

export default SearchPage;
