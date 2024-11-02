import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        const { title, description, imageUrl, price, categoryId } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await prisma.course.create({
            data: {
                userId,
                title,
                description,
                imageUrl,
                price,
                isPublished: false,
                categoryId,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(course);
    } catch (error) {
        console.log("[COURSES]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
