import Mux from "@mux/mux-node";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db"

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID,
    tokenSecret: process.env.MUX_TOKEN_SECRET,
  });

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string }}
    
) {
    try{
        const { userId } = await auth();
        const { isPublished, ...values } = await req.json();
        const newparams = await params;

        if(!userId){
            return new NextResponse("Unauthorized", { status:401 })
        }

        const ownCourse = await db.course.findFirst({
            where: {
                id: newparams.courseId,
                userId
            }
        });

        if(!ownCourse){
            return new NextResponse("Unauthorized", { status:401 })
        }

        const chapter = await db.chapter.update({
            where: {
                id: newparams.chapterId,
                courseId: newparams.courseId
            },
            data: {
                ...values,
            }
        });

        
        if(values.videoUrl)
            {
                const existingMuxData=await db.muxData.findFirst({
                    where:{
                        chapterId:newparams.chapterId,
                    }
                })
    
                const asset = await video.assets.create({
                    input: values.videoUrl,
                    playback_policy: ['public'],
                    test:false,
                  });
    
                await db.muxData.create({
                    data:{
                        chapterId:newparams.chapterId,
                        assetId:asset.id,
                        playbackId:asset.playback_ids?.[0]?.id,
                    }
                })
                
            }
    

        return NextResponse.json(chapter);
    }catch(error){
        console.log("[COURSES_CHAPTER_ID]", error);
        return new NextResponse("Internal Error", {status: 500 });
    }
}