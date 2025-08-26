"use server";

import prisma from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

// to insert data from login 
export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return;

    // check if user exists

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) return existingUser;

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    console.log("Error in syncUser", error);
  }
}

export async function getUserByClerkId(clerkId:string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include:{
      _count:{
       select: {
         followers: true,
        following: true,
        posts: true
       }

      }
    }
  })
}



export async function getDbUserId(){
  const { userId: clerkId } = await auth();
  if(!clerkId) return null

  const user = await getUserByClerkId(clerkId);

  if(!user) throw new Error("User not found");

  return user.id;
}


export async function getRandomUsers(){
  try{
    const userId = await getDbUserId();

    if(!userId) return [];

    //get 3 random users
    const randomUsers = await prisma.user.findMany({
      where: {
        AND:[
          {
            NOT: {
              followers:{
                some:{
                  followerId: userId
                }
              }
            }
          }
        ]
      },
      select:{
        id: true,
        name: true,
        username: true,
        image: true,
        _count:{
          select:{
            followers: true,
          }
        }
      },
      take:3,
    })

    return randomUsers
  }catch(error){
    console.log("Error fetching random users", error);
  }
}


// export async function toggleFollow(targetuserId:string){
//   try{
//     const userId = await getDbUserId();
//     if(!userId === targetuserId) throw new Error("you cannot follow yourself");
//     const existingFollow = await prisma.follows.findUnique({
//       where:{
//         followerId_followingId:{
//           followerId: userId,
//           followingId: targetuserId
//         }
//       }
//     }) 
//     if(existingFollow){
//       //unfollow
//       await prisma.follows.delete({
//        where:{
//         followerId_followingId:{
//           followerId: userId,
//           followingId: targetuserId
//         }
//       })
//       }
//      else {
//         // follow
//         await prisma.$transaction([
//         prisma.follows.create({
//             data: {
//             followerId:userId,
//             followingId: targetuserId
//           }
//         }),
//         prisma.notification.create({
//           data:{
//             type : "FOLLOW",
//             userId: targetuserId, // user being followng
//             creatorId: userId
//           }
//         })
//         ])
//       }
//     }
//   }

// }


export async function toggleFollow(targetUserId: string) {
  try {
    const userId = await getDbUserId();

    if(!userId) return ;

    if (userId === targetUserId) throw new Error("You cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      // Follow (inside transaction)
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: userId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId, // the user being followed
            creatorId: userId,    // who followed
          },
        }),
      ]);
    }
  } catch (error) {
    console.error("Error in toggleFollow:", error);
    throw error; // rethrow for API response
  }
}

