"use client"
import React, { useEffect, useState } from 'react'
import { MoreHorizontal } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input} from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Product } from '@/app/models/product/ProductModels'
import { addProduct, deleteProduct, getAllProducts, updateProduct } from '@/app/services/product/ProductService'
import { Textarea } from '@/components/ui/textarea'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown} from "lucide-react"
import { CATEGORIES, ROLE, TOKEN } from '@/app/core/constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { User } from '@/app/models/user/UserModels';


export default function ProductDialog(props: any) {
    console.log("props " + props);
    const [stock, setStock] = useState(-1);
    const [discount, setDiscount] = useState(-1);
    const [price, setPrice] = useState(-1);
    const [comment, setComment] = useState("");
    const [description, setDescription] = useState("");
    const [name, setProductName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    function saveProduct(){
        if(props.action == "CREATE"){
          createProduct(extractProductCreateInterface());
        }else{
          update(extractProductUpdateInterface(props.productBefore));
        }
    }
    
    const extractProductCreateInterface = () => {
        return {
            name: name,
            category: category,
            discount: discount,
            price: price,
            stock: stock,
            description: description,
            comment: comment,
            image: image
        } as Product
    }   

    const extractProductUpdateInterface = (product: Product) => {
    return {
        _id:product._id,
        name: product.name,
        category: product.category,
        discount: discount == -1 ? product.discount : discount,
        price: price == -1 ? product.price : price,
        stock: stock == -1 ? product.stock : stock,
        description: description == "" ? product.description : description,
        comment: comment,
        image:product.image,
        nbSales:product.nbSales,
        addedDate:product.addedDate
    } as Product
    }   
    
    function extract64Base(e :any){
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
        if(reader.result != null){
            if(reader.result.toString() !== ''){
                setImage(reader.result.toString());
            } 
        }
    }
    }
    
    function createProduct(product: Product): void {
        addProduct(product, props.token)
            .then(response => {
                if(response.data){
                    toast.success(product.name + " ajouté avec succes");
                    props.reloadData(product.category);
                    props.setOpenStatus(false);
                }else{
                    toast.error("Echec de l'ajout");
                }
            }).catch(error => {
                toast.error("Echec de l'ajout : " + error.response.data.message);
            });
    }

    function update(product:Product){
        updateProduct(product, props.token)
        .then(response => {
            if(response.data){
                toast.success(product.name + " mis à jour avec succes");
                props.reloadData(product.category);
                props.setOpenStatus(false);
            }else{
                toast.error("Echec de la mise à jour");
            }
        }).catch(error => {
            toast.error("Echec de la mise à jour : " + error.response.data.message);
        });
    }

    return (
        <Dialog open={props.open} onOpenChange={props.setOpenStatus}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{props.action == "EDIT" ? "Mise à jour produit" : "Création produit"}</DialogTitle>
              <DialogDescription>
                {props.action == "EDIT" ? "Produit : " + props.productBefore?.name : "Entrez les informations du produit ici"}
              </DialogDescription>
            </DialogHeader>

            <div className="grid max-w-sm items-center gap-1.5 my-5">
                <Input id="picture" type="file" accept=".png,.jpg,.jpeg" onChange={e => extract64Base(e)}/>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Nom</Label>
                <Input defaultValue={props.productBefore?.name} onChange={e => setProductName(e.target.value)} />
              </div>
              <Select onValueChange={(e) => setCategory(e)} disabled={props.action == "EDIT"} defaultValue={props.productBefore?.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Categorie..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem className="cursor-pointer" value={category.title}>{category.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-3 gap-6">
                <div className="grid gap-2">
                  <Label>Stock</Label>
                  <Input type='number' min={props.action == "CREATE" ? 1 : 0} defaultValue={props.productBefore?.stock} onChange={e => setStock(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <Label>Remise en %</Label>
                  <Input min="0" max="100" defaultValue={props.productBefore?.discount} onChange={e => setDiscount(Number(e.target.value))} />
                </div>
                <div className="grid gap-2">
                  <Label>Prix</Label>
                  <Input min="0" defaultValue={props.productBefore?.price} onChange={e => setPrice(Number(e.target.value))} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Comment</Label>
                <Input defaultValue={props.productBefore?.comment} onChange={e => setComment(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea defaultValue={props.productBefore?.description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => saveProduct()}>Sauvegarder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
  )
}
