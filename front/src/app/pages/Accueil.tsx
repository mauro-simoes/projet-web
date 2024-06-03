import React from 'react';
import {
  Card,
  CardContent,
  CardTitle,
  CardHeader,
} from "@/components/ui/card"
import { Link } from 'react-router-dom';
import Header from '../core/Header';
import { CATEGORIES } from '../core/constants';
import Footer from '../core/Footer';


export default function Accueil() {

  return (
    <>
    <Header onLoginPage={false}/>
    <div className="home-page mx-auto mt-20">
      <h1 className="text-3xl font-bold text-center my-5">Découvrez nos catégories</h1>
      <div className="flex flex-wrap justify-center gap-15 p-10">
        {CATEGORIES.map((category) => (
          <Link key={category.id} to={`/categories/${category.id}`}>
            <div className="w-60 p-5">
              <Card style={{ height: '300px' }} className='hover:opacity-60 duration-700'>
                <CardHeader>
                  <CardTitle>{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={category.img} className="w-full" alt="img non trouvé" />
                </CardContent>
              </Card>
            </div>
          </Link>
        ))}
      </div>
    </div>
    <Footer/>
    </>
  );
};
