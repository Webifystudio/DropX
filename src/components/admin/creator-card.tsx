
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Creator } from '@/lib/types';
import { CheckCircle, Users, FileImage, Plus } from 'lucide-react';
import { AddEditCreatorDialog } from './add-edit-creator-dialog';

type CreatorCardProps = {
  creator: Creator;
};

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <AddEditCreatorDialog creator={creator}>
        <Card className="rounded-2xl cursor-pointer hover:shadow-lg transition-shadow duration-300">
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
            <p className="text-sm text-muted-foreground mt-1">{creator.title}</p>
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
    </AddEditCreatorDialog>
  );
}
