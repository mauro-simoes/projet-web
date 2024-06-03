"use client"

import { AuthResponse, SignUpRequest } from '@/app/models/auth/AuthModels';
import { signUp } from '@/app/services/auth/AuthServices';
import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";


import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import  {Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ROLE, TOKEN } from '@/app/core/constants';
import { toast } from 'sonner';
import Header from '@/app/core/Header';
const formSchema = z.object({
    nom: z.string().min(1,"Veuillez entrer votre nom"),
    prenom: z.string().min(1,"Veuillez entrer votre prenom"),
    email: z.string().email("Veuillez entrer un mail valide"),
    password: z.string().min(8,"Le mot de passe doit contenir au moins 8 caractères"),
    adresse: z.string().min(1,"Veuillez entrer votre addresse"),
})

const initialState = {
    email:"",
    prenom:"",
    nom: "",
    adresse: "",
    password:""
} 

export default function SignUp() {

    useEffect(() =>{
        if(localStorage.getItem(TOKEN) != null){
            navigate("/accueil",{replace: true});
        }
    },[])

    const navigate = useNavigate();

    const extractInterface = (values: z.infer<typeof formSchema>) => {
        return {
            email:values.email,
            firstName: values.prenom,
            lastName: values.nom,
            address: values.adresse,
            password: values.password} as SignUpRequest
    }

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues:initialState,
        resolver: zodResolver(formSchema)
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        signUp(extractInterface(values))
        .catch(error => {
            toast.error("Echec de l'inscription",  error.response.data.message);
        })
        .then(authResponse => {
            if(authResponse != null && authResponse.data != null){
                handleToken(authResponse.data);
                navigate("/accueil",{replace: true});
            }  
        });
    }

    function handleToken(authResponse :AuthResponse){
        localStorage.setItem(TOKEN, authResponse.token);
        localStorage.setItem(ROLE, authResponse.role);
    }

    return (
        <><Header onLoginPage={true} /><Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-xl">Inscription</CardTitle>
                <CardDescription>
                    Veuillez entrer vos informations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="nom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="prenom"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prenom</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="adresse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Adresse</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <div className="grid gap-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Mot de Passe</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                            </div>
                            <Button type="submit" className="w-full">S'inscrire</Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Vous avez déjà un compte ?{" "}
                        <Link to="/connexion" className="underline">Connectez-vous</Link>
                    </div>
                </Form>
            </CardContent>
        </Card></>
    );
}
