
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

type CreatorCardProps = {
  name: string;
  title: string;
  avatarUrl: string;
};

export function CreatorCard({ name, title, avatarUrl }: CreatorCardProps) {
  return (
    <div className="text-center">
      <div className="relative inline-block mb-4">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-full"></div>
        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary/95">
             <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover"
                data-ai-hint="person photo"
            />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="text-sm text-primary-foreground/70">{title}</p>
    </div>
  );
}
