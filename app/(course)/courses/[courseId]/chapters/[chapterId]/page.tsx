import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";

import { getChapter } from "@/actions/get-chapter";


import { VideoPlayer } from "./_components/video-player";
import { Banner } from "@/components/ui/banner";
// import { CourseEnrollButton } from "./_components/course-enroll-button";
// import { CourseProgressButton } from "./_components/course-progress-button";

const ChapterIdPage = async ({
  params
}: {
  params: { courseId: string; chapterId: string }
}) => {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/");
  } 
const newParams=await params;
  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: newParams.chapterId,
    courseId: newParams.courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }


  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return ( 
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={newParams.chapterId}
            title={chapter.title}
            courseId={newParams.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        
    </div>
    </div>
   );
}
 
export default ChapterIdPage;