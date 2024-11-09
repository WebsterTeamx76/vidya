import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { Categories } from "./_components/categories";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  // const courses = await getCourses({
  //   userId,
  //   ...searchParams,
  // });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white text-black py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-2/5">
            {/* Text Content */}
            <div className="max-w-md text-center md:text-left md:mr-12">
            {/* <p className="text-sm md:text-xl mb-8 text-gray">
                "Our mision is to help people to find the best course - online and learn with expert anywhere"
              </p> */}
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6 whitespace-nowrap">
                Find the Right Courses for You
              </h1>
              <p className="text-lg md:text-xl mb-8">
                Explore a wide range of courses in various categories.
              </p>
             
           
            </div>
          </div>
          <div className="md:w-3/5 flex justify-center md:justify-end">
            {/* Image */}
            <img
              src="https://educax-next.thetork.com/images/banner/home3/1.png"
              alt="Hero Image"
              className="w-80 h-auto md:rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        {/* <CoursesList items={courses} /> */}
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <div className="flex justify-center space-x-4">
          {/* <a href="/terms" className="hover:underline">
            Terms and Conditions
          </a>
          <span>|</span> */}
    <a href="mailto:rajatshukla1000@gmail.com" className="hover:underline">
            Contact Us
          </a>
        </div>
        <p className="mt-4 text-sm">
          © {new Date().getFullYear()} Vidya. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default SearchPage;
