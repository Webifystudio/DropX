
'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AddEditStoreDialog } from '@/components/admin/add-edit-store-dialog';
import type { Store } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'stores'), (snapshot) => {
      const storesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Store));
      setStores(storesData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const openDialog = (store: Store | null = null) => {
    setEditingStore(store);
    setIsDialogOpen(true);
  };

  const deleteStore = async (storeId: string) => {
    if (window.confirm('Are you sure you want to delete this store? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'stores', storeId));
        toast({ title: 'Store Deleted', description: 'The store has been successfully removed.' });
      } catch (error) {
        toast({ title: 'Error', description: 'Failed to delete the store.', variant: 'destructive' });
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Stores</CardTitle>
            <CardDescription>Manage your creator storefronts.</CardDescription>
          </div>
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Store
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Store Name</TableHead>
                <TableHead>Creator ID</TableHead>
                <TableHead>Creator Email</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : (
                stores.map((store) => (
                  <TableRow key={store.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={store.logoUrl} />
                          <AvatarFallback>{store.id.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{store.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>{store.creatorId}</TableCell>
                    <TableCell>{store.creatorEmail}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openDialog(store)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteStore(store.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <AddEditStoreDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        store={editingStore}
      />
    </>
  );
}
