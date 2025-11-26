'use client';

import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, orderBy } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, User as UserIcon } from 'lucide-react';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Order, User } from '@/models/types';


function AccountSkeleton() {
    return (
        <div className="container mx-auto max-w-4xl py-8 md:py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center p-6">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="mt-4 space-y-2 w-full">
                                <Skeleton className="h-6 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-full mx-auto" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                             <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader className="p-6">
                            <CardTitle>My Orders</CardTitle>
                             <CardDescription>View your past orders and their status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6 pt-0">
                           {[...Array(3)].map((_, i) => (
                               <div key={i} className="flex justify-between items-center p-4 border rounded-md">
                                   <div className="space-y-1">
                                       <Skeleton className="h-5 w-24" />
                                       <Skeleton className="h-4 w-32" />
                                       <Skeleton className="h-4 w-20" />
                                   </div>
                                   <Skeleton className="h-8 w-20" />
                               </div>
                           ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<User>(userDocRef);

  const ordersCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return query(collection(firestore, `users/${user.uid}/orders`), orderBy('orderDate', 'desc'));
  }, [firestore, user]);
  const { data: orders, isLoading: areOrdersLoading } = useCollection<Order>(ordersCollectionRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user || isUserDataLoading) {
    return <AccountSkeleton />;
  }

  const userInitial = userData?.firstName ? userData.firstName.charAt(0).toUpperCase() : (user.email ? user.email.charAt(0).toUpperCase() : '');

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto max-w-6xl py-8 md:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader className="items-center text-center p-6">
                             <Avatar className="h-24 w-24 text-4xl">
                                {user.photoURL ? <AvatarImage src={user.photoURL} alt={userData?.firstName || ''} /> : null}
                                <AvatarFallback><UserIcon size={48} /></AvatarFallback>
                            </Avatar>
                            <CardTitle className="mt-4 font-headline text-xl md:text-2xl">{userData?.firstName} {userData?.lastName}</CardTitle>
                            <CardDescription className="break-all">{user.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="text-center p-6 pt-0">
                            <Button variant="outline">Edit Profile</Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader className="p-6">
                            <CardTitle className="font-headline text-2xl">My Orders</CardTitle>
                            <CardDescription>View your past orders and their status.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6 pt-0">
                           {areOrdersLoading ? (
                                <div className="space-y-4">
                                  {[...Array(3)].map((_, i) => (
                                      <div key={i} className="flex justify-between items-center p-4 border rounded-md">
                                          <div className="space-y-1">
                                              <Skeleton className="h-5 w-24" />
                                              <Skeleton className="h-4 w-32" />
                                              <Skeleton className="h-4 w-20" />
                                          </div>
                                          <Skeleton className="h-8 w-20" />
                                      </div>
                                  ))}
                               </div>
                           ) : orders && orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                           <div className="grid gap-1">
                                                <p className="font-semibold text-sm">Order ID: {order.id.substring(0, 8)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Date: {new Date(order.orderDate).toLocaleDateString()}
                                                </p>
                                                <p className="font-bold text-lg">Rs{order.totalAmount.toFixed(2)}</p>
                                           </div>
                                           <div className="flex flex-col items-start sm:items-end gap-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize bg-${order.status === 'completed' ? 'green' : 'yellow'}-100 text-${order.status === 'completed' ? 'green' : 'yellow'}-800`}>
                                                    {order.status}
                                                </span>
                                                <Button variant="outline" size="sm">View Details</Button>
                                           </div>
                                        </div>
                                    ))}
                                </div>
                           ) : (
                               <div className="text-center py-12 md:py-16 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
                                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">No Orders Yet</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">You haven't placed any orders with us.</p>
                                    <Button asChild className="mt-6">
                                        <a href="/">Start Shopping</a>
                                    </Button>
                                </div>
                           )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
  );
}
