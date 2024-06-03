"use client"
import React, { useEffect, useState } from 'react'
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { approveUserAccount, getAllUsers, suspendUserAccount } from '../../services/user/UserService'
import { User } from '../../models/user/UserModels'
import { Button } from '@/components/ui/button'
import { ACCOUNT_STATUSES, RADIE, TOKEN, } from '../../core/constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'


export default function UserManagement() {

  const navigator = useNavigate();

  const [users,setUsers] = useState([{} as User]);

  function approveAccount(id :string){
    let tokenLocalStorage = localStorage.getItem(TOKEN);
    if(tokenLocalStorage == null){
      navigator("/accueil",{replace:true});
    }else{
      approveUserAccount(id, tokenLocalStorage).
      then(data => {
        if(data){
          toast.success("Profil validé avec succes");
          loadData(tokenLocalStorage);
        }else{
          toast.error("Echec de la validation");
        }
      }).
      catch(error => {
        toast.error("Echec de la validation" + error.response.message);
      });
    }
  }

  function suspendAccount(id :string){
    let tokenLocalStorage = localStorage.getItem(TOKEN);
    if(tokenLocalStorage == null){
      navigator("/accueil",{replace:true});
    }else{
      suspendUserAccount(id, tokenLocalStorage).
      then(data => {
        if(data){
          toast.success("Profil radié avec succes");
          loadData(tokenLocalStorage);
        }else{
          toast.error("Echec de la radiation");
        }
      }).
      catch(error => {
        toast.error("Echec de la radiation" + error.response.message);
      });
    }
  }

  function loadData(token:string){
    getAllUsers(token)
      .then(response => {
          if(response.data != null){
            setUsers(response.data);
          }
      }).catch(error => {
        toast.error("Les utilisateurs n'ont pas pu etre recuperes : " + error.response.data.message);
     });
  }

  useEffect(() => {
      let tokenLocalStorage = localStorage.getItem(TOKEN);
      if(tokenLocalStorage == null){
        navigator("/accueil",{replace:true});
      }else{
        loadData(tokenLocalStorage);
      }
  },[]);

  return (
        <Card className='overflow-y-auto max-h-[600px]'>
          <CardHeader className="px-7">
            <CardDescription className="text-center">Gerez les utilisateurs ici</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Statut Compte</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                      <TableCell>
                        <div className="font-medium">{user?.lastName?.toUpperCase()} {user.firstName}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge className="text-xs" variant={user.accountStatus == RADIE ? "destructive" : "outline"}>
                          {ACCOUNT_STATUSES[user.accountStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            {user.accountStatus == RADIE ?
                              <DropdownMenuItem className='cursor-pointer' onClick={() => approveAccount(user._id)}>Valider</DropdownMenuItem>
                              :
                              <DropdownMenuItem className='cursor-pointer' onClick={() => suspendAccount(user._id)}>Radier</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
  )
}