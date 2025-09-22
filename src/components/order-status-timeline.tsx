
'use client';

import { Package, CheckCircle, Truck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Order } from '@/lib/types';

type OrderStatusTimelineProps = {
    status: Order['status'];
};

const statuses = [
    { name: 'Processing', icon: Package },
    { name: 'Confirmed', icon: CheckCircle },
    { name: 'Shipped', icon: Truck },
    { name: 'Delivered', icon: Home },
];

export function OrderStatusTimeline({ status }: OrderStatusTimelineProps) {
    const currentStatusIndex = statuses.findIndex(s => s.name === status);

    // If status is 'Cancelled', we show a different UI
    if (status === 'Cancelled') {
        return (
             <div className="flex items-center p-4 rounded-lg bg-destructive/10 text-destructive">
                <CheckCircle className="h-8 w-8 mr-4" />
                <div>
                    <h3 className="font-bold">Order Cancelled</h3>
                    <p className="text-sm">This order has been cancelled.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex justify-between items-start relative">
             <div className="absolute top-4 left-0 w-full h-1 bg-muted">
                <div 
                    className="h-1 bg-primary transition-all duration-500" 
                    style={{width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%`}}
                />
            </div>
            {statuses.map((s, index) => {
                const isActive = index <= currentStatusIndex;
                return (
                    <div key={s.name} className="flex flex-col items-center text-center z-10">
                        <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                             isActive ? "bg-primary border-primary text-primary-foreground" : "bg-background border-muted-foreground/50 text-muted-foreground"
                        )}>
                            <s.icon className="h-5 w-5" />
                        </div>
                        <p className={cn(
                            "mt-2 text-xs font-medium",
                            isActive ? "text-primary" : "text-muted-foreground"
                        )}>{s.name}</p>
                    </div>
                )
            })}
        </div>
    );
}
