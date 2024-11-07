
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string, attachmentId: string } }
) {
    try {
        const { userId }=await auth();
        const {courseId,attachmentId}=await params;

        console.log("-----------------------------");
        console.log(courseId);
        console.log(attachmentId);


        if (!userId) {
            return new NextResponse("Unauthorized",{status:500})
        }

        const courseOwner = await db.course.findUnique({
            where:{
                id:courseId,
                userId:userId
            }
        })

        if(!courseOwner)
            return new NextResponse("Unauthorized",{status:401})

        const attachment = await db.attachment.delete({
            where:{
                courseId:courseId,
                id:attachmentId,
            }
        });

        return NextResponse.json(attachment);
    } catch (error) {
        console.log("ATTACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}