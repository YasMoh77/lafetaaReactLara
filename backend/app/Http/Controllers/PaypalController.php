<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Srmklive\PayPal\Services\ExpressCheckout;
use Illuminate\Support\Facades\Log;
use App\Models\Ad;
use App\Models\External;




class PaypalController extends Controller 
{  

   public function paypalPayment( $plan,$price,$id,$phone)
   {   
         
       $thePlan=$plan==1?'باقة ذهبية':'باقة فضية';

       //price according to exchange rates of dollar and Egyptian pound
       $exchangeRate=48.34;
       $amount=round($price/$exchangeRate);
      
       $product = [];
       $product['items'] = [
           [   
               'name' => $thePlan,
               'price' => $amount,
               'desc'  => 'd',
               //'qty' => 1
           ]
       ];
 
       $product['invoice_id'] = $plan;
       $product['invoice_description'] = "تمييز لافتة - خطة  {$product['invoice_id']} "."( ".$thePlan." )";//$product['invoice_id']
       $product['items'][0]['desc'];
       $product['return_url'] = route('paypalSuccess', ['id' => $id, 'plan' => $plan, 'price' => $price, 'phone' => $phone  , 'amount' => $amount]);
       $product['cancel_url'] = route('paypalCancel'); 
       $product['total'] = $amount;
 
       $paypalModule = new ExpressCheckout();
     
        $response = $paypalModule->setExpressCheckout($product);
        $response = $paypalModule->setExpressCheckout($product,true);
        return redirect($response['paypal_link']);              
   }


  
   public function paypalCancel()
   {
   return redirect('http://localhost:3000/cancel-pay?t=eyJpdiI6Im13QmdIRHQ4eW1VMXZtUEw1VS93Tmc9PSIsInZhbHVlIjoicGdidWY0VEYrUWVQdVJZcTB4N1h6dz09IiwibWFjIjoiNzg3OTEwNzAzZGZhZDg1YjFmNGUzYzU1Zjg4NGNjNTNmYWVhM2FlODNkNzc1ODVkZTBlYTAyODc4YjA1M2I0MCIsInRhZyI6IiJ9');

   }

 

   public function paypalSuccess(Request $request)
   {
      $paypalModule = new ExpressCheckout();
      $response = $paypalModule->getExpressCheckoutDetails($request->token);
       
       if (in_array(strtoupper($response['ACK']), ['SUCCESS', 'SUCCESSWITHWARNING'])) {
        
         // get the variables coming from success route
        $id=$request->id;
        $amount=$request->amount;
        $phone=$request->phone;
        $price=$request->price;
        $plan=$request->plan;
        
         //prepare to insert in external_pay table
        $ext=new External();
        $title=Ad::where('item_id',$id)->value('NAME'); 

       if($plan==1 && $price==300){ //gold with 300 L.E.
          $ext->item_id=$id; $ext->title=$title; $ext->method='paypal'; $ext->amount=$amount; $ext->phone=$phone; $ext->plan='GOLD';
          Ad::where('item_id',$id)->update(['gold'=>1,'feature'=>2]);

        }elseif($plan==1 && $price==150){ //gold with 150 L.E. (upgraded from silver to gold)
          $ext->item_id=$id; $ext->title=$title; $ext->method='paypal'; $ext->amount=$amount; $ext->phone=$phone; $ext->plan='GOLD';
          Ad::where('item_id',$id)->update(['gold'=>1,'silver'=>0,'feature'=>2]);

       }else{ //silver with 150 L.E.
          $ext->item_id=$id; $ext->title=$title; $ext->method='paypal'; $ext->amount=$amount; $ext->phone=$phone; $ext->plan='SILVER';
          Ad::where('item_id',$id)->update(['silver'=>1,'feature'=>1]);

       }
        $ext->save();

        return redirect('http://localhost:3000/success-pay-external?t=eyJpdiI6ImswWWNxWHNSRW9nY1hlVU5wY3VYMmc9PSIsInZhbHVlIjoid2JuOUNKZmlZcm1qb2ZwL0xWR25Xdz09IiwibWFjIjoiOGM2NGZjMzI4YmE3YjQ5ZjZjNDg0ZmE3NTRkNGQxMzFlZTkwYTBjNTJmZTA4MDgyNGVkODMyZmY0NTM3NzFjZCIsInRhZyI6IiJ9');

       }

   }

  
   


}


