import connectMongoDB from "@/lib/mongodb";
import wishModel from '@/models/wishlist'
import { NextResponse } from "next/server";

type Props = {
    params: {
        email: any
    }
}

export async function GET(request:Request,{ params: { email } }: Props) {
    try{
        connectMongoDB();
        const wishlist = await wishModel.find({email:email});
        console.log(wishlist)
        let products=[]
        for(const product of wishlist){
            const res = await fetch(`https://fakestoreapi.com/products/${product.product_id}`)
            const data = await res.json();
            products.push(data);
        }
        return NextResponse.json({list:products,msg:"Done"});
    }
    catch{
        return NextResponse.json({msg:"Couldn't get Cart Data"})
    }
}

export async function DELETE(request:Request,{ params: { email } }: Props){
    const { id } = await request.json();
    try{
        connectMongoDB();
        const wishlist = await wishModel.findOneAndDelete({email:email , product_id:id})
        await wishlist.save();
        return NextResponse.json({msg:"Done"});
    }
    catch{
        return NextResponse.json({msg:"Couldn't Delete Data"})
    }
}