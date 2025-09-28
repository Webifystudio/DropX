
'use client';

import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Creator } from '@/lib/types';

type FindUidDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  creators: Creator[];
};

export function FindUidDialog({ isOpen, onOpenChange, creators }: FindUidDialogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const filteredCreators = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    return creators.filter(creator =>
      creator.email && creator.email.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5); // Limit to 5 results
  }, [searchQuery, creators]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} has been copied to your clipboard.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find Creator Auth ID</DialogTitle>
          <DialogDescription>
            Search for a creator by their email address to find their unique Auth ID.
          </DialogDescription>
        </DialogHeader>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Search by email..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
          {searchQuery.trim() && filteredCreators.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">No creators found.</p>
          )}
          {filteredCreators.map(creator => (
            <div key={creator.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{creator.name}</p>
                  <p className="text-xs text-muted-foreground">{creator.email}</p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={() => copyToClipboard(creator.creatorId, 'Creator Auth ID')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
