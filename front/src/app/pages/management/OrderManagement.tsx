"use client"
import React, { useEffect, useState } from 'react'
import { MoreHorizontal } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input} from '@/components/ui/input'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"
import { ArrowUpDown} from "lucide-react"
import { ROLE, TOKEN } from '@/app/core/constants'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { Order } from '@/app/models/product/Order'
import { getPendingOrders, shipOrder } from '@/app/services/product/OrderService'


export default function OrderManagement() {

  const navigator = useNavigate();

  const [orders,setOrders] = useState<Order[]>([]);


  function loadData(){
    let localToken = localStorage.getItem(TOKEN);
    if(localToken!=null){
      getPendingOrders(localToken)
        .then(response => {
            if(response.data != null)
              setOrders(response.data);
            else{
              toast.error("Il n'y a pas de commandes");
          }
      }).catch(error => {
        toast.error("Les commandes n'ont pas pu être récupérés : " + error.response.data.message);
      });
    }
    
  }

  useEffect(() => {
      let localToken = localStorage.getItem(TOKEN)
      if( localToken == null){
        navigator("/accueil",{replace:true});
        return;
      }
      let role = localStorage.getItem(ROLE);
      if(role == null || role != "ADMIN"){
        navigator("/accueil",{replace:true});
        return;
      }
      loadData();
  },[]);

  function expedier(order:Order){
    let localToken = localStorage.getItem(TOKEN);
    if(localToken!=null){
      shipOrder(localToken, order)
        .then(response => {
            if(response.data)
              toast.success("Ordre expédié avec succes");
            loadData();
      }).catch(error => {
        toast.error("L'ordre n'a pas pu etre expédié : " + error.response.data.message);
      });
    }
  }

  const columns: ColumnDef<Order,any>[] = [
    {
      accessorKey: "_id",
      accessorFn:(row) => row._id,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Commande
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("_id")}</div>,
    },
    {
      accessorKey: "commandDateTime",
      accessorFn:(row) => row.commandDateTime,
      header: () => <div>Promotion en %</div>,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("commandDateTime")}</div>
      },
    },
    {
      accessorKey: "total",
      accessorFn:(row) => row.total,
      header: () => <div>Total</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"))
        const formatted = new Intl.NumberFormat("fr", {
          style: "currency",
          currency: "EUR",
        }).format(amount)
  
        return <div className="font-medium">{formatted}</div>
      },
    },
    {
      accessorKey: "deliveryAddress",
      accessorFn:(row) => row.deliveryAddress,
      header: () => <div>Adresse de livraison</div>,
      cell: ({ row }) => {
        return <div className="font-medium">{row.getValue("deliveryAddress")}</div>
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem className='cursor-pointer' onClick={() => expedier(row.original)}>Expedier</DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
          </>
        )
      },
    },
  ]
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({});


  const table = useReactTable<Order>({
    data: orders,
    columns: columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4 justify-between">
        <Input
          placeholder="Filtrez les commandes..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Pas de resultats.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}