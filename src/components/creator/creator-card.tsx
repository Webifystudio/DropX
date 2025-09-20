
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Plus, Users, FileText } from 'lucide-react';

type CreatorCardProps = {
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  followers: number;
  posts: number;
  isVerified: boolean;
};

export function CreatorCard({ name, title, bio, avatarUrl, followers, posts, isVerified }: CreatorCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardContent className="p-4">
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4">
          <Image
            src={avatarUrl}
            alt={name}
            fill
            className="object-cover"
            data-ai-hint="person photo"
          />
        </div>
        <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold">{name}</h3>
                {isVerified && <CheckCircle className="h-5 w-5 text-green-500 fill-current" />}
            </div>
            <p className="text-sm text-muted-foreground mb-2">{title}</p>
            <p className="text-sm text-foreground/80 mb-4">{bio}</p>
            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span className="font-medium text-foreground">{followers}</span>
                    </div>
                     <div className="flex items-center gap-1.5 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium text-foreground">{posts}</span>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg">
                    <Plus className="h-4 w-4 mr-1" />
                    Follow
                </Button>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
