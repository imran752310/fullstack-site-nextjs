"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";

function CreatePost() {
  // const { user } = useUser();
  // const [content, setContent] = useState("");
  // const [imageUrl, setImageUrl] = useState("");
  // const [isPosting, setIsPosting] = useState("");
  // const [showImageUpload, setshowImageUpload] = useState("");

const { user } = useUser();
const [content, setContent] = useState<string>("");       // string
const [imageUrl, setImageUrl] = useState<string>("");     // string
const [isPosting, setIsPosting] = useState<boolean>(false); // boolean
const [showImageUpload, setShowImageUpload] = useState<boolean>(false); // boolean


  const handleSubmit = async () => {
    if(!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try{
     const result = await createPost(content,imageUrl);
     if(result?.success){
      //reset the form
      setContent("");
      setImageUrl("");
      setShowImageUpload(false);

      toast.success("POst created Successfully")
     }
    }catch (error){
      console.error("Faild to create post", error);
      toast.error("Failed to create post")
    }finally{
      setIsPosting(false)
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Avatar className="w-10 h-210 rounded-full">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} className="rounded-full" />
            </Avatar>
            <Textarea
              placeholder="what's on your mind"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
            </div>
          </div>

          {/* ToDO : handle image upload  */}
          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
                
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button className="flex items-center"
            onClick={handleSubmit}
            disabled={(!content.trim() && !imageUrl || isPosting)}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatePost;
