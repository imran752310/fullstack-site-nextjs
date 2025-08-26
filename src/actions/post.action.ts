"use server";

import prisma from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export async function createPost(content: string, imageUrl: string) {
  try {
    const userId = await getDbUserId();

    if (!userId) return;

    const post = await prisma.post.create({
      data: {
        content: content || null, // ✅ handle null/undefined safely
        image: imageUrl || null, // ✅ store image url, not Next.js Image component
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error };
  }
}

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count:{
          select:{
            likes: true,
            comments: true
          }
      }
      
      }
    });
    return posts
  } catch (error) {
    console.log("Error in GetPOsts", error);
    throw new Error("falid to fetch posts")
  }
}

export async function toggleLike(postId: string) {
  try {
    const userId = await getDbUserId();
    if (!userId) return;

    // check if like exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) throw new Error("Post not found");

    if (existingLike) {
      // unlike
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
    } else {
      // like and create notification
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("failed to toggle like", error);
    return { success: false, error: "failed to toggle like" };
  }
}



// export async function toggleLike(postId:string) {
//   try{
//     const userId = await getDbUserId();
//     if(!userId) return

//     //check if like exits
//     const existingLike = await prisma.like.findUnique({
//       where: {
//         userId_postId: {
//           userId,
//           postId,
//         }
//       }
//     });

//     const post = await prisma.post.findUnique({
//       where: {
//         id: postId
//       },
//       select: {
//         authorId:true
//       },
//     }),
//     if(!post) throw new Error("Post not found");
//     if(existingLike) {
//       //unlike
//       await prisma.like.delete({
//         where: {
//           userId_postId: {
//             userId,
//             postId,
//           },
//         }
//       });
//     }else {
//       // like and create notificaion
//       await prisma.$transaction([
//         prisma.like.create({
//           data: {
//             userId,
//             postId,
//           },
//         }),
//         ...(post.authorId !== userId
//           ? [
//             prisma.notification.create({
//               data:{
//                 type: "LIKE",
//                 userId:post.authorId,
//                 creatorId: userId,
//                 postId
//               },
//             }),
//           ]
//           : []
//         )
//       ]);
//       revalidatePath("/");
//     }catch(error) {
//       console.error("faild to toggle like", error);
//       return {success: false, error: "faild to toggle like"};
//     }
//   }
// }

// "use server";

// import prisma from "@/lib/prisma";
// import { getDbUserId } from "./user.action";
// import { revalidatePath } from "next/cache";
// import image from "next/image";

// export async function createPost(content:string, imageUrl:string) {

//     try{
//         const userId = await getDbUserId();

//         const post = await prisma.post.create({
//             data: {
//                 content,
//                 image,
//                 authorId: userId,
//             },
//         });
//         revalidatePath("/")
//         return {success: true, post};
//     }catch(error){

//     }
// }
