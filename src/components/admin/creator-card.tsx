
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Creator } from '@/lib/types';
import { CheckCircle, Users, FileImage, Plus, Copy } from 'lucide-react';
import { AddEditCreatorDialog } from './add-edit-creator-dialog';
import { useToast } from '@/hooks/use-toast';

type CreatorCardProps = {
  creator: Creator;
};

export function CreatorCard({ creator }: CreatorCardProps) {
    const { toast } = useToast();

    const copyId = () => {
        navigator.clipboard.writeText(creator.id);
        toast({
            title: "Copied!",
            description: "Creator ID has been copied to your clipboard.",
        })
    }

  return (
    <Card className="rounded-2xl relative group/card">
        <AddEditCreatorDialog creator={creator}>
            <button className="absolute top-2 right-2 z-10 p-2 rounded-full bg-background/50 backdrop-blur-sm text-foreground opacity-0 group-hover/card:opacity-100 transition-opacity text-xs">
                Edit
            </button>
        </AddEditCreatorDialog>
        <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="relative w-full aspect-square mb-4">
                <Image
                    src={creator.avatarUrl}
                    alt={creator.name}
                    fill
                    className="rounded-xl object-cover"
                    data-ai-hint="person photo"
                />
            </div>
            <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-lg">{creator.name}</h3>
                {creator.isVerified && <CheckCircle className="h-5 w-5 text-green-500 fill-green-100" />}
            </div>
             <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground cursor-pointer" onClick={copyId}>
                <span>ID: {creator.id.slice(0, 8)}...</span>
                <Copy className="h-3 w-3" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center h-10 overflow-hidden">{creator.description}</p>
            
            <div className="flex justify-center gap-6 my-4 text-muted-foreground">
                <div className="text-center">
                    <Users className="h-5 w-5 mx-auto" />
                    <span className="text-sm font-semibold">{creator.followers}</span>
                </div>
                <div className="text-center">
                    <FileImage className="h-5 w-5 mx-auto" />
                    <span className="text-sm font-semibold">{creator.posts}</span>
                </div>
            </div>

            <Button className="w-full rounded-full">
                <Plus className="h-4 w-4 mr-2" />
                Follow
            </Button>

        </CardContent>
    </Card>
  );
}
