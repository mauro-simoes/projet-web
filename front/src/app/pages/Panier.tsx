"use client"

import React, { useEffect } from 'react';
import { PANIER, TOKEN } from '../core/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { getProductById } from '../services/product/ProductService';
import { toast } from 'sonner';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, Purchase } from '../models/product/Order';
import { Input } from '@/components/ui/input';
import Header from '../core/Header';
import { getBasketInfo, placeOrder } from '../services/product/OrderService';
import { Product } from '../models/product/ProductModels';
import Footer from '../core/Footer';

export default function Panier() {


  const navigator = useNavigate();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [token,setToken] = useState("");
  const [total,setTotal] = useState(0);

  function supprimerProduit(purchase:Purchase){
    let purchaseList = purchases;
    let foundPurchase =  purchaseList.find(element => element.product._id == purchase.product._id);
    if(foundPurchase != null){
      const index = purchaseList.indexOf(foundPurchase, 0);
      if (index > -1) {
        purchaseList.splice(index, 1);
      }
    }
    let panier = localStorage.getItem(PANIER)
    if(panier != null){
      let panierJson = JSON.parse(panier);
      delete panierJson[purchase.product._id];
      localStorage.setItem(PANIER,JSON.stringify(panierJson));
    }
    setAllPurchases(purchaseList);
  }

  function removeAll(){
    localStorage.removeItem(PANIER)
    setAllPurchases([]);
  }

  useEffect(() => {
    let localToken = localStorage.getItem(TOKEN)
    if( localToken == null){
      navigator("/accueil",{replace:true});
    }else{
      let panier = localStorage.getItem(PANIER)
      if(panier != null){
        loadData(panier,localToken);
    }
    }
  },[]);

  function loadData(basket:string,localToken:string){
    getBasketInfo(basket,localToken)
      .then(response => {
          if(response.data != null){
            setAllPurchases(response.data);
        }
    }).catch(error => {
       toast.error("Erreur : " + error.response.data.message);
      });
  }

  function setAllPurchases(purchaseList:Purchase[]){
    let totalPrice = 0;
    purchaseList.forEach(element => {
      totalPrice += element.purchasePrice;
    });
    setTotal(totalPrice);
    setPurchases(purchaseList);
  }

  function order(){
    let localToken = localStorage.getItem(TOKEN)
    if( localToken == null){
      navigator("/accueil",{replace:true});
    }else{
      let purchaseList:Purchase[] = [];
      purchases.forEach(element => {
        purchaseList.push({quantite:element.quantite, product:{id:element.product._id} as Product} as Purchase)
      });
      placeOrder({purchases:purchaseList} as Order,localToken)
      .then(response => {
          if(response.data != null){
            toast.success("La commande est passée ");
            removeAll();
        }
      }).catch(error => {
        toast.error("Erreur : " + error.response.data.message);
      });
    }
    
  }

  function setQuantity(purchase :Purchase, value:string){
    let intValue = parseInt(value);
    let purchaseList = purchases;
    let foundPurchase =  purchaseList.find(element => element.product._id == purchase.product._id);
    if(foundPurchase != null){
      let purchasePrice = foundPurchase.purchasePrice / foundPurchase.quantite;
      foundPurchase.quantite = intValue;
      foundPurchase.purchasePrice = (purchasePrice * intValue);
    }
    setAllPurchases(purchaseList);
  }


  return (

      <>
      
      <Header onLoginPage={false}/>
      
      <Card className='overflow-y-auto mx-auto max-h-[600px]'>
        <CardHeader>
          <CardTitle>Panier</CardTitle>
          <CardDescription>
            Gérez votre panier et procédez au paiement.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="hidden md:table-cell">Image</span>
                </TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="hidden md:table-cell">
                  <span>Prix</span>
                </TableHead>
                <TableCell className="hidden md:table-cell">
                  <span>Quantité</span>
                </TableCell>
                <TableHead className="hidden md:table-cell">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.product._id}>
                  <TableCell className="hidden sm:table-cell">
                    <img src={purchase.product.image}></img>
                  </TableCell>
                  <TableCell className="font-medium">
                    {purchase.product.name}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {purchase.purchasePrice.toFixed(2)} €
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Input min="1" type="number" defaultValue={purchase.quantite} onChange={e => setQuantity(purchase, e.target.value)} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Button onClick={() => supprimerProduit(purchase)}>Supprimer</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <span className="ml-10 mt-5">Total : {total.toFixed(2)} €</span>
        <div className='mb-10 mr-5 flex justify-end'>
          <Button onClick={() => order()}>Payer</Button>
        </div>
      </Card>
      <Footer/>
    </>
    
  );
}