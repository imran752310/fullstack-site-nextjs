"use client";
import { getPosts, toggleLike } from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent } from "./ui/card";
import Link from "next/link";
import { Avatar } from "@radix-ui/react-avatar";
import { AvatarImage } from "./ui/avatar";
import { formatDistanceToNow } from "date-fns";
import DeleteAlterDialog from "./DeleteAlterDialog";

type Posts = Awaited<ReturnType<typeof getPosts>>;
type Post = Posts[number];

export default function PostCard({ post, dbUserId }: { post: any; dbUserId: string }) {
  const { user } = useUser();
  const [newComment, setNewComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const [hasLiked, setHasLiked] = useState(
    post.likes.some((like) => like.userId === dbUserId)
  );
  const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

  // ✅ Handle likes
  const handleLike = async () => {
    if (isLiking) return;
    try {
      setIsLiking(true);
      setHasLiked((prev) => !prev);
      setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
      await toggleLike(post.id);
    } catch (error) {
      setOptimisticLikes(post._count.likes);
      setHasLiked(post.likes.some((like) => like.userId === dbUserId));
    } finally {
      setIsLiking(false);
    }
  };

  // ✅ Handle comments
  const handleAddComment = async () => {
    if (!newComment.trim() || isCommenting) return;
    try {
      setIsCommenting(true);
      const result = await createComment(post.id, newComment);
      if (result?.success) {
        toast.success("Comment posted successfully");
        setNewComment("");
      }
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  // ✅ Handle delete
  const handleDeletePost = async () => {
    if (isDeleting) return;
    try {
      setDeleting(true);
      const result = await deletePost(post.id);
      if (result.success) toast.success("Post deleted successfully");
      else throw new Error(result.error);
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden mt-4">
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex space-x-3 sm:space-x-4">
            <Link href={`/profile/${post.author.username}`}>
              <Avatar className="size-6 sm:w-10 sm:h-10">
                <AvatarImage
                  className="w-10 h-10 rounded-full"
                  src={post.author.image ?? "/avatar.png"}
                />
              </Avatar>
            </Link>

            {/* post header and text */}
            <div className="flex-1 main-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
                  <Link
                    href={`/profile/${post.author.username}`}
                    className="font-semibold truncate"
                  >
                    {post.author.name}
                  </Link>
                </div>
              </div>
              <div className="flex justify-between space-x-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Link href={`/profile/${post.author.username}`}>
                    @{post.author.username}
                  </Link>
                  <span>.</span>
                  <span>
                    {formatDistanceToNow(new Date(post.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {dbUserId === post.author.id && (
                  <DeleteAlterDialog
                    isDeleting={isDeleting}
                    onDelete={handleDeletePost}
                  />
                )}
              </div>
              <p className="mt-2 text-sm text-foreground break-words">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


// "use client";
// import { getPosts, toggleLike } from "@/actions/post.action";
// import { useUser } from "@clerk/nextjs";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { Card, CardContent } from "./ui/card";
// import Link from "next/link";
// import { Avatar } from "@radix-ui/react-avatar";
// import { AvatarImage } from "./ui/avatar";
// import { formatDistanceToNow } from "date-fns";
// import DeleteAlterDialog from "./DeleteAlterDialog";

// type Posts = Awaited<ReturnType<typeof getPosts>>;
// type Post = Posts[number];

// export default function PostCard({ post, dbUserId }: { post: any; dbUserId: string }) {
  
//   const { user } = useUser();
//   const [newComment, setNewComment] = useState("");
//   const [isCommenting, setIsCommenting] = useState(false);
//   const [isLiking, setIsLiking] = useState(false);
//   const [isDeleteing, setDeleting] = useState(false);

//   const [hasLiked, setHasLiked] = useState(
//     post.likes.some((like) => like.userId === dbUserId)
//   );
//   const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

//   // ✅ Handle likes
//   const handleLike = async () => {
//     if (isLiking) return; // prevent double-click
//     try {
//       setIsLiking(true);
//       setHasLiked((prev) => !prev);
//       setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
//       await toggleLike(post.id);
//     } catch (error) {
//       setOptimisticLikes(post._count.likes);
//       setHasLiked(post.likes.some((like) => like.userId === dbUserId));
//     } finally {
//       setIsLiking(false);
//     }
//   };

//   // ✅ Handle comments
//   const handleAddComment = async () => {
//     if (!newComment.trim() || isCommenting) return;
//     try {
//       setIsCommenting(true);
//       const result = await createComment(post.id, newComment);
//       if (result?.success) {
//         toast.success("Comment posted successfully");
//         setNewComment("");
//       }
//     } catch (error) {
//       toast.error("Failed to add comment");
//     } finally {
//       setIsCommenting(false);
//     }
//   };

//   // ✅ Handle delete
//   const handleDeletePost = async () => {
//     if (isDeleteing) return;
//     try {
//       setDeleting(true);
//       const result = await deletePost(post.id);
//       if (result.success) toast.success("Post deleted successfully");
//       else throw new Error(result.error);
//     } catch (error) {
//       toast.error("Failed to delete post");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   return (
//     <Card className="overflow-hidden mt-4">
//       <CardContent className="p-4 sm:p-6">
//         <div className="space-y-3">
//           <div className="flex space-x-3 sm:space-x-4">
//             <Link href={`/profile/${post.author.username}`}>
//               <Avatar className="size-6 sm:w-10 sm:h-10">
//                 <AvatarImage
//                   className="w-10 h-10 rounded-full"
//                   src={post.author.image ?? "/avatar.png"}
//                 />
//               </Avatar>
//             </Link>

//             {/* post header and text */}
//             <div className="flex-1 main-w-0">
//               <div className="flex items-start justify-between">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
//                   <Link
//                     href={`/profile/${post.author.username}`}
//                     className="font-semibold truncate"
//                   >
//                     {post.author.name}
//                   </Link>
//                 </div>
//               </div>
//               <div className="flex justify-between space-x-2 text-sm text-muted-foreground">
//                 <div className="flex items-center space-x-2 text-sm text-muted-foreground">
//                   <Link href={`/profile/${post.author.username}`}>
//                     @{post.author.username}
//                   </Link>
//                   <span>.</span>
//                   <span>
//                     {formatDistanceToNow(new Date(post.createdAt), {
//                       addSuffix: true,
//                     })}
//                   </span>
//                 </div>
//                 {dbUserId === post.author.id && (
//                   <DeleteAlterDialog
//                     isDeleting={isDeleteing}
//                     onDelete={handleDeletePost}
//                   />
//                 )}
//               </div>
//               <p className="mt-2 text-sm text-foreground break-words">
//                 {post.content}
//               </p>
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }






// }
// // "use client";
// // import { getPosts, toggleLike } from "@/actions/post.action";
// // import { useUser } from "@clerk/nextjs";
// // // import { Post } from "@prisma/client"
// // import { useState } from "react";
// // import toast from "react-hot-toast";
// // import { Card, CardContent } from "./ui/card";
// // import Link from "next/link";
// // import { Avatar } from "@radix-ui/react-avatar";
// // import { AvatarImage } from "./ui/avatar";
// // import { format } from "path";
// // import { formatDistanceToNow } from "date-fns";
// // import DeleteAlterDialog from "./DeleteAlterDialog";

// // type Posts = Awaited<ReturnType<typeof getPosts>>;
// // type Post = Posts[number];

// // function PostCard({ post, dbUserId }: { post: Post; dbUserId: string | null }) {
// //   const { user } = useUser();
// //   const [newComment, setNewComment] = useState("");
// //   const [isCommenting, setIsCommenting] = useState(false);
// //   const [isLiking, setIsLiking] = useState(false);

// //   const [isDeleteing, setDeleting] = useState(false);
// //   const [hasLiked, setHasLiked] = useState(
// //     post.likes.some((like) => like.userId === dbUserId)
// //   );
// //   const [OptimisticLikes, setOptimisticLikes] = useState(post._count.likes);

// //   //handle likes
// //   const handleLike = async () => {
// //     if (!isLiking) return;
// //     try {
// //       setIsLiking(true);
// //       setHasLiked((prev) => !prev);
// //       setOptimisticLikes((prev) => prev + (hasLiked ? -1 : 1));
// //       await toggleLike(post.id);
// //     } catch (error) {
// //       setOptimisticLikes(post._count.likes);
// //       setHasLiked(post.likes.some((like) => like.userId === dbUserId));
// //     } finally {
// //       setIsLiking(false);
// //     }
// //   };
// //   //handle Comments
// //   const handleAddComment = async () => {
// //     if (!newComment.trim() || isCommenting) return;
// //     try {
// //       setIsCommenting(true);
// //       const result = await createComment(post.id, newComment);
// //       if (result?.success) {
// //         toast.success("Comment posted successfully");
// //         setNewComment("");
// //       }
// //     } catch (error) {
// //       toast.error("Failed to add comment");
// //     } finally {
// //       setIsCommenting(false);
// //     }
// //   };
// //   ////handle Delete
// //   const handleDeletePost = async () => {
// //     if (isDeleteing) return;
// //     try {
// //       setDeleting(true);
// //       const result = await handleDeletePost(post.id);
// //       if (result.success) toast.success("post deleted successfully");
// //       else throw new Error(result.error);
// //     } catch (error) {
// //       toast.error("faild to delete post");
// //     } finally {
// //       setDeleting(false);
// //     }
// //   };

// //     function formatDistanceToNow(arg0: Date): import("react").ReactNode {
// //         throw new Error("Function not implemented.");
// //     }

// //   return (
// //     <Card className="overflow-hidden">
// //       <CardContent className="p-4 sm:p-6">
// //         <div className="space-y-3">
// //           <div className="flex space-x-3 sm:space-x-4">
// //             <Link href={`/profile/${post.author.username}`}>
// //               <Avatar className="size-6    sm:w-10 sm:h-10">
// //                 <AvatarImage
// //                   className="w-10 h-10 rounded-full"
// //                   src={post.author.image ?? "/avatar.png"}
// //                 />
// //               </Avatar>
// //             </Link>

// //             {/* post header and text */}
// //             <div className="flex-1 main-w-0">
// //               <div className="flex items-start justify-between">
// //                 <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 truncate">
// //                   <Link
// //                     href={`/profile/${post.author.username}`}
// //                     className="font-semibold truncate"
// //                   >
// //                     {post.author.username}
// //                   </Link>
// //                 </div>
// //               </div>
// //               <div>
// //                 <div className="flex items-center space-x-2 text-sm text-muted-foreground">
// //                   <Link href={`/profile/${post.author.username}`}>
// //                     @{post.author.username}
// //                   </Link>
// //                   <span>.</span>
// //                   <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
// //                 </div>
// //                 {dbUserId === post.author.id && (
// //                   <DeleteAlterDialog
// //                     isDeleteing={isDeleteing}
// //                     onDelete={handleDeletePost}
// //                   />
// //                 )}
// //               </div>
// //               <p className="mt-2 text-sm text-foreground break-words">
// //                 {post.content}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </CardContent>
// //     </Card>
// //   );
// // }

// // export default PostCard;
