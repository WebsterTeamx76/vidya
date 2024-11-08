import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutDashboard,Video } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/chapter-video-form";
import { ChapterActions } from "./_components/chapter-actions";
const ChapterIdPage = async ({
    params
}: {
    params: { courseId: string; chapterId: string }
}) =>  {
    const { userId } = await auth();
    const newparams = await params;

    if(!userId){
        return redirect("/")
    }
    const chapter = await db.chapter.findFirst({
        where: {
            id: newparams.chapterId,
            courseId: newparams.courseId
        },
        include: {
            muxData: (true),
        },
    });

    if(!chapter) {
        return redirect("/") 
    }

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;

    const completionText = `(${completedFields}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);
    console.log(newparams)

    return ( 
    <div className="p-6">
        <div className="flex items-center justify-between ">
            <div className="w-full">
                <Link href={`/teacher/courses/${newparams.courseId}`}
                className="flex items-center text-sm hover:opacity-75 trasition mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2"/>
                    Back to course setup
                </Link>
                <div className="flex items-center justify-between w-full">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Chapter Creation
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <ChapterActions
                disabled={!isComplete}
                courseId={newparams.courseId}
                chapterId={newparams.chapterId}
                isPublished={chapter.isPublished}
              />
                </div>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <div className="space-y-4">
                <div>
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard}/>
                        <h2 className="text-xl">
                            Customize Your Chapter
                        </h2>
                    </div>
                    <ChapterTitleForm 
                        initialData={chapter}
                        courseId={newparams.courseId}
                        chapterId={newparams.chapterId}
                    />
                    <ChapterDescriptionForm
                   initialData={chapter}
                   courseId={newparams.courseId}
                   chapterId={newparams.chapterId}
                    />
                    <div>
                        <div className="flex gap-x-2 flex-col">
                            <div className="flex items-start m-4">
                                <IconBadge icon={Eye}/>
                                <h2 className="text-xl">
                                    Access Settings
                                </h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={newparams.courseId}
                                chapterId={newparams.chapterId}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div>
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={Video} />
                            <h2 className="text-xl">
                                Add a video
                            </h2>
                        </div>
                        <ChapterVideoForm
                        initialData={chapter}
                        chapterId={newparams.chapterId}
                        courseId={newparams.courseId}
                        />
                    </div>
        </div>    
    </div> );
}
 
export default ChapterIdPage;