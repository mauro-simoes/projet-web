import React, { useEffect, useState } from 'react';

import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from "@/components/ui/card"
  
  import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom'
import { Order } from '@/app/models/product/Order';
import { getAllOrders } from '@/app/services/product/OrderService';
import { toast } from 'sonner';
import { TOKEN } from '@/app/core/constants';
import { Separator } from '@radix-ui/react-menubar';
import Header from '@/app/core/Header';
  
export default function Orders() {

    const [orders,setOrders] = useState<Order[]>([]);

    const navigator = useNavigate();

    function loadData(token:string){
        getAllOrders(token)
          .then(response => {
              if(response.data != null)
                setOrders(response.data);
              else{
                toast.error("Vous n'avez pas de commande");
            }
        }).catch(error => {
           toast.error("Vos commandes n'ont pas pu être récupérés : " + error.response.data.message);
        });
    }
    
    useEffect(() => {
        let localToken = localStorage.getItem(TOKEN)
        if( localToken == null){
            navigator("/accueil",{replace:true});
        }else{
            loadData(localToken);
        }
    },[]);



    return (
        <>
        
        
        <Header onLoginPage={false}/>
        
        
        
        <Card className='overflow-y-auto mx-auto max-h-[600px]'>
            <CardHeader className="px-7">
                <CardDescription className="text-center">Consultez vos commandes ici</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Numero</TableHead>
                            <TableHead>Date de commance</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Adresse de livraison</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>
                                    <div className="font-medium">{order._id}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <div className="font-medium">{new Date(order.commandDateTime).toISOString().split('T')[0]}</div>
                                </TableCell>
                                <TableCell>
                                    {order.total.toFixed(2)} €
                                </TableCell>
                                <TableCell>
                                    {order.deliveryAddress}
                                </TableCell>
                                <TableCell>

                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline">Voir plus</Button>
                                        </SheetTrigger>
                                        <SheetContent>


                                            <Card className="my-5 overflow-hidden">
                                                <CardHeader className="flex flex-row items-start bg-muted/50">
                                                    <div className="grid gap-0.5">
                                                        <CardTitle className="group flex items-center gap-2 text-lg">
                                                            Commande n {order._id}
                                                        </CardTitle>
                                                        <CardDescription>Date: {new Date(order.commandDateTime).toISOString().split('T')[0]}</CardDescription>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-6 text-sm">
                                                    <div className="grid gap-3">
                                                        <div className="font-semibold">Details commande</div>
                                                        <ul className="grid gap-3">
                                                            {order.purchases.map((purchase) => (
                                                                <li key={purchase.product._id} className="flex items-center justify-between">
                                                                    <span className="text-muted-foreground">
                                                                        {purchase.product.name} x <span>{purchase.quantite}</span>
                                                                    </span>
                                                                    <span>{purchase.purchasePrice.toFixed(2)} €</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <Separator className="my-2" />
                                                        <ul className="grid gap-3">
                                                            <li className="flex items-center justify-between font-semibold">
                                                                <span className="text-muted-foreground">Total</span>
                                                                <span>{order.total.toFixed(2)} €</span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <Separator className="my-4" />
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="grid gap-3">
                                                            <div className="font-semibold">Livraison</div>
                                                            <address className="grid gap-0.5 not-italic text-muted-foreground">
                                                                <span>{order.deliveryAddress}</span>
                                                            </address>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </SheetContent>
                                    </Sheet>


                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        
        
        </>
    )
}
