"use client"

import { AuthResponse, LogInRequest } from '@/app/models/auth/AuthModels';
import { logIn } from '@/app/services/auth/AuthServices';
import React, { useEffect, useState } from 'react'
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
  } from "@/components/ui/form";
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
import { APIResponseModel } from '@/app/models/ApiResponseModel';
import { toast } from 'sonner';
import Header from '@/app/core/Header';

const formSchema = z.object({
    email: z.string().email("Veuillez entrer un mail valide"),
    password: z.string().min(8,"Le mot de passe doit contenir au moins 8 caractères"),
});

const initialState = {
    email:"",
    password:""
} 

export default function LogIn() {

    useEffect(() =>{
        if(localStorage.getItem(TOKEN) != null){
            navigate("/accueil",{replace: true});
        }
    },[])

    const navigate = useNavigate();
    
    const extractInterface = (values: z.infer<typeof formSchema>) => {
        return {
            email:values.email,
            password: values.password} as LogInRequest
    }

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues:initialState,
        resolver: zodResolver(formSchema),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        logIn(extractInterface(values))
        .catch(error => {
            toast.error("Echec de la connexion : " + error.response.data.message);
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
        <><Header onLoginPage={true}/><Card className="mx-auto max-w-sm shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl">Connexion</CardTitle>
                <CardDescription>
                    Veuillez entrer vos informations
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
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
                            <Button type="submit" className="w-full">Connexion</Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Vous n'avez pas de compte ?{" "}
                        <Link to="/inscription" className="underline">Inscrivez-vous</Link>
                    </div>
                </Form>
            </CardContent>
        </Card></>
        
    );
}
