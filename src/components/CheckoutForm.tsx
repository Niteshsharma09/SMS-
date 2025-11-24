'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, Wallet } from 'lucide-react';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const formSchema = z.object({
  // Shipping
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City must be at least 2 characters.' }),
  state: z.string().min(2, { message: 'State/Province must be at least 2 characters.' }),
  zip: z.string().min(5, { message: 'ZIP/Postal code must be at least 5 characters.' }),
  
  // Payment
  paymentMethod: z.enum(['card', 'cod'], { required_error: 'You need to select a payment method.'}),
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.paymentMethod === 'card') {
        if (!data.cardName || data.cardName.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['cardName'],
                message: 'Name on card is required.',
            });
        }
        if (!data.cardNumber || !/^\d{16}$/.test(data.cardNumber)) {
             ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['cardNumber'],
                message: 'Card number must be 16 digits.',
            });
        }
        if (!data.cardExpiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.cardExpiry)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['cardExpiry'],
                message: 'Expiry must be in MM/YY format.',
            });
        }
        if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['cardCvc'],
                message: 'CVC must be 3 or 4 digits.',
            });
        }
    }
});

export function CheckoutForm() {
  const { clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      paymentMethod: 'card',
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
    },
  });

  const paymentMethod = form.watch('paymentMethod');

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
        console.log(values);
        toast({
            title: 'Order Placed!',
            description: 'Thank you for your purchase. We will notify you when it ships.',
        });
        clearCart();
        router.push('/');
        setIsSubmitting(false);
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
            <h2 className="font-headline text-2xl">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                        <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                        <Input placeholder="1234 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="San Francisco" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                            <Input placeholder="CA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ZIP / Postal Code</FormLabel>
                        <FormControl>
                            <Input placeholder="94103" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>

        <div className="space-y-4">
            <h2 className="font-headline text-2xl">Payment Details</h2>
             <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                        >
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                            <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                            <CreditCard className="h-5 w-5" /> Credit/Debit Card
                            </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                            <RadioGroupItem value="cod" />
                            </FormControl>
                            <FormLabel className="font-normal flex items-center gap-2">
                             <Wallet className="h-5 w-5" /> Cash on Delivery
                            </FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
        </div>
        
        {paymentMethod === 'card' && (
            <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Name on Card</FormLabel>
                        <FormControl>
                            <Input placeholder="John M Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Card Number</FormLabel>
                        <FormControl>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="•••• •••• •••• ••••" {...field} className="pl-9" />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="cardExpiry"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Expiration (MM/YY)</FormLabel>
                            <FormControl>
                                <Input placeholder="MM/YY" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cardCvc"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>CVC</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="•••" {...field} className="pl-9"/>
                                </div>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )}
        
        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </Form>
  );
}
