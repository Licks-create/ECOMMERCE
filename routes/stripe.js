const router=require("express").Router()
const asyncHandler=require("express-async-handler")
const stripe=require("stripe")(process.env.STRIPE_KEY)





router.post('/create-checkout-session', asyncHandler(async (req, res) => {
 const  {productsAdded}=req.body
 
  const productsBillingDetails=productsAdded.map(product=>({
    price_data: {
      currency: 'inr',
      product_data: {
        name:product.title||'T-shirt',
      },
      unit_amount: product.price*100,
    },
    quantity: product.quantity,
  }))

    const session = await stripe.checkout.sessions.create({
      line_items:productsBillingDetails,
      mode: 'payment',
      success_url:`${process.env.CLIENT_URL}/checkout-success`,
      cancel_url:`${process.env.CLIENT_URL}/cart`,
    });   
  
    res.status(200).json({url:session.url});

  }));
  
module.exports=router


// router.post("/payment",asyncHandler(async(req,res,next)=>{
//     stripe.charges.create({
//         source:req.body.tokenId,
//         amount:req.body.amount,
//         currency:"inr"
//     },(stripeError,stripeRes)=>{
//         if(stripeError){
//             return res.status(404).json(stripeError)
//         }
//         else{
//             return res.status(200).json(stripeRes)
//         }
//     })
// }))

