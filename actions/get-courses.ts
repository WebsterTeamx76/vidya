import { Category, Course } from "@prisma/client";

import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";

type CourseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

type GetCourses = {
  userId?: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async course => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null,
          }
        }

        const progressPercentage = await getProgress(userId, course.id);

        return {
          ...course,
          progress: progressPercentage,
        };
      })
    );

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}

export const getCoursesTitles = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<string[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      select: {
        title: true
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return courses.map(course => course.title);
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}

export const getPublishedCoursesTitles = async (userId: string): Promise<string[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        userId: userId // Filter courses based on the provided userId
      },
      select: {
        title: true
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return courses.map(course => course.title);
  } catch (error) {
    console.log("[GET_COURSES_TITLES]", error);
    return [];
  }
}
export const getPublishedCoursesTitlesWithIds = async (userId: string): Promise<{ title: string; courseId: string }[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        userId: userId // Filter courses based on the provided userId
      },
      select: {
        id: true,
        title: true
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return courses.map(course => ({ title: course.title, courseId: course.id }));
  } catch (error) {
    console.log("[GET_PUBLISHED_COURSES_TITLES_WITH_IDS]", error);
    return [];
  }
}