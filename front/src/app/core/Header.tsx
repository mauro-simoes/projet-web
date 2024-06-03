"use client"
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
  } from "@/components/ui/menubar";
import { useEffect, useState } from "react";
import { ROLE, TOKEN } from "./constants";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "../models/user/UserModels";
import { getUserInfo } from "../services/user/UserService";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function Header(props:any){

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userIsAdmin, setUserIsAdmin] = useState(false);
  const [user,setUser] = useState<User>();

  const navigate = useNavigate();
  
  useEffect(() =>{
    let localToken = localStorage.getItem(TOKEN);
    if(localToken != null){
      setUserLoggedIn(true);
      getUserInfo(localToken)
      .then(response => {
          if(response.data != null){
            setUser(response.data);
          }
      }).catch(error => {
          toast.error("Echec de la recuperation de vos informations: " + error.response.data.message);
      });
    }
    if(localStorage.getItem(ROLE) != null && localStorage.getItem(ROLE) == "ADMIN"){
      setUserIsAdmin(true);
    }
  },[])

  function logOut(){
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(ROLE);
    navigate("/connexion",{replace: true});
  }

  return(
    <Menubar className="bg-orange-500 text-white fixed top-0 w-full h-[80px] px-5 py-3 rounded-none">
        <div className="flex items-center justify-between w-full">
          <MenubarMenu>
            <div className="flex space-x-4">
              <Link to="/accueil">Accueil</Link>
              {userIsAdmin && <Link to="/gestion">Gestion</Link>}
            </div>
            <div className="flex space-x-4">
              {
                userLoggedIn &&
                  <>
                    <div className="ml-auto flex items-center space-x-4">
                      {!userIsAdmin && <span>{user?.balance.toFixed(2)} €</span>}
                      {!userIsAdmin &&  <Link to="/panier"><img src="shopping-bag.svg" alt="Panier" /></Link>}
                      <MenubarTrigger className="px-3 py-2 cursor-pointer">
                          <Avatar className="w-[50px] h-[50px]">
                            <AvatarImage src={user?.avatar == null ? "blank-profile.jpeg" : user?.avatar} />
                          </Avatar>
                      </MenubarTrigger>
                    </div>
                    <MenubarContent>
                        <Link to="/profil"><MenubarItem className="px-3 py-2 cursor-pointer">Profil</MenubarItem></Link>
                        {!userIsAdmin && <Link to="/commandes"><MenubarItem className="px-3 py-2 cursor-pointer">Vos Commandes</MenubarItem></Link>}
                        <Link to="/accueil"><MenubarItem className="px-3 py-2 cursor-pointer" onClick={() => logOut()}>Déconnexion</MenubarItem></Link>
                    </MenubarContent>
                  </> 
              }
              {
                !userLoggedIn && !props.onLoginPage &&
                <>
                  <Button variant="secondary" className="mx-8" onClick={() => navigate("/inscription",{replace:true})}>Inscription</Button>
                  <Button variant="secondary" onClick={() => navigate("/connexion",{replace:true})}>Connexion</Button>
                </>
              }
            </div>
          
          </MenubarMenu>
        </div>
      </Menubar>
  );
}