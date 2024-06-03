"use client"
import React, { useEffect, useState } from 'react'
import  {Link, useNavigate } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {Avatar, AvatarImage } from '@/components/ui/avatar';
import { depotArgent, getUserInfo, updateUserPassword, updateUserProfile } from '../../services/user/UserService';
import { PasswordChangeRequest, User } from '../../models/user/UserModels';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { TOKEN } from '@/app/core/constants';
import Header from '@/app/core/Header';

export default function Profile() {

    const navigator = useNavigate();

    const extractUserUpdateInterface = () => {
        return {
            id:user.id,
            email: user.email,
            firstName: prenom == "" ? user.firstName : prenom,
            lastName: nom == "" ? user.lastName : nom,
            address: adresse == "" ? user.address : adresse,
            note: user.note,
            avatar: avatar == "" ? user.avatar : avatar,
            accountStatus : user.accountStatus
        } as User
    }

    function extract64Base(e :any){
        let reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            if(reader.result != null){
                if(reader.result.toString() !== ''){
                    setAvatar(reader.result.toString());
                } 
            }
        }
    }

    const [currentPassword,setMotDePasseActuel] = useState("");
    const [newPassword,setNouveauMotDePasse] = useState("");
    const [balance, setBalance] = useState(10);

    const [user,setUser] = useState({} as User);
    const [adresse,setAdresse] = useState("");
    const [prenom,setPrenom] = useState("");
    const [nom,setNom] = useState("");
    const [avatar,setAvatar] = useState("");

    useEffect(() => {
        let token = localStorage.getItem(TOKEN);
        if(token == null){
            navigator("/accueil",{replace:true});
            return;
        }else{
            getUserInfo(token)
            .then(response => {
                if(response.data != null){
                    setUser(response.data);
                    if(response.data.avatar == null || response.data.avatar == ""){
                        setAvatar("blank-profile.jpeg");
                    }else{
                        setAvatar(response.data.avatar);
                    }
                }
            }).catch(error => {
                toast.error("Echec de la recuperation de votre profil: " + error.response.data.message);
            });
        }
    },[]);

    function updateProfile() {
        let token = localStorage.getItem(TOKEN);
        if(token == null){
            navigator("/accueil",{replace:true});
            return;
        }else{
            updateUserProfile(extractUserUpdateInterface(), token)
            .then(data => {
                if(data){
                    toast.success("Profil mis à jour avec succes");
                }else{
                    toast.error("Echec de la mise à jour");
                }
            }).catch(error => {
                toast.error("Echec de la mise à jour : " + error.response.data.message);
            });
        }
    }

    function updatePassword() {
        let token = localStorage.getItem(TOKEN);
        if(token == null){
            navigator("/accueil",{replace:true});
            return;
        }else{
            updateUserPassword({currentPassword, newPassword} as PasswordChangeRequest, token)
            .then(data => {
                if(data){
                    toast.success("Mot de passe mis à jour avec succes");
                }else{
                    toast.error("Echec de la mise à jour");
                }
            }).catch(error => {
                toast.error("Echec de la mise à jour : " + error.response.data.message);
            });
        }
    }

    function updateBalance() {
        let token = localStorage.getItem(TOKEN);
        if(token == null){
            navigator("/accueil",{replace:true});
            return;
        }else{
            depotArgent(balance, token)
            .then(data => {
                if(data){
                    toast.success("L'argent a été déposé avec succes");
                }
            }).catch(error => {
                toast.error("Echec de la mise à jour : " + error.response.data.message);
            });
        }
    }

    return (
        <>
        
        <Header/>
        
        <Tabs defaultValue="account" className="mx-auto w-[600px">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="account">Profil</TabsTrigger>
            <TabsTrigger value="password">Mot de passe</TabsTrigger>
            {user.role == 'USER' && <TabsTrigger value="depot">Depot</TabsTrigger>}
          </TabsList>
          <TabsContent value="account">
            <Card>
                <CardHeader className='items-center'>
                    <CardDescription>
                        Mettez à jour vos informations ici.
                    </CardDescription>
                    <Avatar className="w-[100px] h-[100px]">
                        <AvatarImage src={avatar} />
                    </Avatar>
                    <div className="grid max-w-sm items-center gap-1.5 my-5">
                        <Input id="picture" type="file" accept=".png,.jpg,.jpeg" onChange={e => extract64Base(e)}/>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="new">Nom</Label>
                                <Input defaultValue={user?.lastName} onChange={e => setNom(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new">Prenom</Label>
                                <Input defaultValue={user?.firstName} onChange={e => setPrenom(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new">Email</Label>
                            <Input defaultValue={user?.email} disabled={true} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="new">Adresse</Label>
                            <Input defaultValue={user?.address} onChange={e => setAdresse(e.target.value)} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='mx-auto' onClick={() => updateProfile()}>Sauvegarder</Button>
                </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password">
            <Card>
              <CardHeader className='items-center'>
                <CardDescription>
                  Changez votre mot de passe ici.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Mot de passe actuel</Label>
                  <Input id="current" type="password" onChange={e => setMotDePasseActuel(e.target.value)}/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">Nouveau mot de passe</Label>
                  <Input id="new" type="password" onChange={e => setNouveauMotDePasse(e.target.value)}/>
                </div>
              </CardContent>
              <CardFooter>
                <Button className='mx-auto' onClick={() => updatePassword()}>Sauvegarder</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="depot">
            <Card>
                <CardHeader className='items-center'>
                    <CardDescription>
                        Deposez de l'argent sur votre compte ici !
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new">Montant à déposer (Min. 10)</Label>
                            <Input id="note" type="number" min="10" defaultValue={balance} onChange={(e) => setBalance(parseFloat(e.target.value))}/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className='mx-auto' onClick={() => updateBalance()}>Sauvegarder</Button>
                </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        
        </>
    
    );
}
