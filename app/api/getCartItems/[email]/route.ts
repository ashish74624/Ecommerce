import connectMongoDB from "@/lib/mongodb";
import cartModel from '@/models/cart'
import { NextResponse } from "next/server";

type Props = {
    params: {
        email: any
    }
}

export async function GET(request:Request,{ params: { email } }: Props) {
    // console.log(email)
    try{
        connectMongoDB();
        const cart = await cartModel.find({email:email});
        let products=[]
        for(const product of cart){
            const res = await fetch(`https://fakestoreapi.com/products/${product.product_id}`)
            const data = await res.json();
            products.push(data);
        }
        return NextResponse.json({cart:products,msg:"Done"});
    }catch{
        return NextResponse.json({msg:"Couldn't get Cart Data"})
    }
}