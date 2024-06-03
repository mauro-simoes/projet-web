import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
  CardFooter
} from "@/components/ui/card"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useEffect } from 'react';
import { getAllProducts} from '../services/product/ProductService';
import { Product } from '../models/product/ProductModels';
import { toast } from 'sonner';
import { CATEGORIES, PANIER, ROLE, TOKEN } from '../core/constants';
import { getUserInfo } from '../services/user/UserService';
import Header from '../core/Header';
import { Purchase } from '../models/product/Order';
import Footer from '../core/Footer';

function DetailCategorie() {
  
  const { categorieId } = useParams();
  const navigate = useNavigate();
  const [userIsAdmin,setUserIsAdmin] = useState(false);

  const[category,setCategory] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [userLoggedIn,setUserLoggedIn] = useState(false);
  const [userId,setUserId] = useState(0);

  function loadData(category:string){
    getAllProducts(category)
      .then(response => {
          if(response.data != null)
            setProducts(response.data);
          else{
            toast.error("Il n'y a pas de produits");
        }
    }).catch(error => {
       toast.error("Les produits n'ont pas pu être récupérés : " + error.response.data.message);
    });
  }

  useEffect(() => {
    if(categorieId != null){
      let categoryObj = CATEGORIES.find(category => category.id === parseInt(categorieId));
      if(categoryObj != null){
        setCategory(categoryObj.title);
        loadData(categoryObj.title);
      }
    }else{
      navigate("/accueil",{replace:true});
    }

    let localToken = localStorage.getItem(TOKEN);
    if(localToken!= null){
      getUserInfo(localToken)
      .then(response => {
        if(response.data != null){
          setUserId(response.data.id);
        }
      })
      .catch(error => {
        toast.error("Echec de la mise à jour : " + error.response.data.message);
      });
      let userIsAdmin = localStorage.getItem(ROLE) == "ADMIN";
      setUserIsAdmin(userIsAdmin);
      setUserLoggedIn(true);
    }
  },[]);

  const ajouterAuPanier = (produit : Product) => {
    let userIsLoggedIn = localStorage.getItem(TOKEN) != null
    if(userIsLoggedIn){
      let panier = localStorage.getItem(PANIER)
      if(panier != null){
        let parsedPanier = JSON.parse(panier);
        parsedPanier[produit._id] = 1;
        localStorage.setItem(PANIER, JSON.stringify(parsedPanier));
      }else{
        let parsedPanier = "{\"" + produit._id + "\":1}"; 
        localStorage.setItem(PANIER, JSON.stringify(JSON.parse(parsedPanier)));
      }
      toast.success(produit.name + " ajouté au panier");
    }else{
      toast.warning("Veuillez vous connecter");
    }
    
  };

  return (
    <>
      <Header />
        <div className="home-page mx-auto mt-20">
          <h1 className="text-3xl font-bold text-center my-10">Découvrez nos {category}</h1>
          <div className="flex flex-wrap justify-center gap-20 p-10">
            {products.map((produit) => (
                <Card key={produit.name}  style={{ height: '350px', width: '240px' }}>
                  <Link to={`/produit/${produit._id}`}>
                    <CardHeader>
                      <CardTitle>{produit.name}</CardTitle>
                    </CardHeader>
                      <CardContent>
                        <img src={produit.image} className="w-full h-auto" alt="img non trouvé" />
                      </CardContent>
                    </Link>
                  <CardFooter className='block'>
                    {produit.discount > 0 && <span className='font-bold text-red-600'> -{produit.discount}% </span>}
                    <span>{produit.discount > 0 ? (produit.price - (produit.price * produit.discount / 100)) : produit.price?.toFixed(2) }€</span>
                    <div className="flex justify-end ">
                    {(!userLoggedIn || (userLoggedIn && !userIsAdmin)) && <Button className='mt-2' onClick={() => ajouterAuPanier(produit)}>
                        Ajouter au panier
                      </Button>}
                    </div>
                  </CardFooter>
                </Card>
            ))}
          </div>
        </div>

        <Footer/>
    </>
  );
  }

export default DetailCategorie;
