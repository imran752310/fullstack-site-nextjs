import { getRandomUsers } from '@/actions/user.action'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Link from "next/link"
import { Avatar, AvatarImage } from "@/components/ui/avatar" // ✅ use Shadcn’s Avatar wrapper
import FollowButton from './FollowButton'

async function WhoToFollow() {
  const users = await getRandomUsers();

  if (!users || users.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who to Follow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user: any) => (
            <div key={user.id} className="flex gap-2 items-center justify-between">
              <div className="flex items-center gap-1">
                <Link href={`/profile/${user.username}`}>
                  <Avatar>
                    <AvatarImage src={user.image ?? "/avatar.png"} />
                  </Avatar>
                </Link>
                <div className='text-sm'>
                    <Link href={`/profile/${user.name}`}>
                    {user.name}
                    </Link>
                    <p className='text-muted-foreground'>@{user.username}</p>
                    <p>{user._count.followers}</p>
                </div>
              </div>
              <FollowButton userId={user.id} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default WhoToFollow



// import { getRandomUsers } from '@/actions/user.action'
// import React from 'react'
// import { Card, CardContent, CardHeader,CardTitle } from './ui/card';
// import { Link } from 'lucide-react';
// import { Avatar, AvatarImage } from '@radix-ui/react-avatar';

// async function WhoToFollow() {

//     const users = await getRandomUsers();

//     if(!users || users.length === 0) return null

//   return (
//     <Card>
//         <CardHeader>
//           <CardTitle>Who to Follow</CardTitle>
//        </CardHeader>
//        <CardContent>
//         <div className='space-y-4'>
//             {users.map((user) => (
//                 <div className='flex gap-2 items-center justify-between'>
//                     <div className='flex items-center gap-1'>
//                 <Link href={`/profile/${username}`} >
//                     <Avatar >
//                         <AvatarImage src={user.image ?? "/avatar.png"} />
//                     </Avatar>
//                 </Link>
//                     </div>
//                 </div>
//             ))}
//         </div>
//        </CardContent>
//     </Card>
//   )
// }

// export default WhoToFollow