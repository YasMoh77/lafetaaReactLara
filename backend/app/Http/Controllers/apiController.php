<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Plan;
use App\Models\Ad;
use App\Models\User; 
use App\Events\VerifyEvent;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;
use App\Events\ResetPassEvent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;



class apiController extends Controller
{
    

    //when user clicks on a link sent to their email     
    public function verify($email)
    {
        //decrypt encrypted email
        $email = Crypt::decrypt($email);
       // check user
       $found= User::where('email',$email)->first();

       $cc=Carbon::now();
       if($found){
           User::where('email',$email)->update(['email_verified_at'=> $cc ]);
           return redirect('http://localhost:3000/verified');
       }
    }



    //respond to user request and send him verification email again 
    public function sendVerify(Request $request)
    {
      $user['name']=$request->nameRegister;
      $user['email']=$request->emailRegister;
      event(new VerifyEvent($user));
      //send response
      return response()->json(['message'=>'تم ارسال رسالة أخرى']);
    }



    //check if user is verified or not
    public function checkVerify(Request $request)
    {
        $email=$request->emailRegister;
        $found= User::where('email',$email)->value('email_verified_at');
        if($found!=null){
             return response()->json([
                 'message'=>'verified'
             ]);
             return redirect('http://localhost:3000/verified');

        }else{
            return response()->json([
                'message'=>'not verified'
            ]);
            return redirect('http://localhost:3000/verified');
        }
    }
    


       //user requested to change password
    public function requestReset(Request $request)
    {
       $email=$request->email;
       $found=User::where('email',$email)->value('id');
       if($found>0){
             return response()->json([
                 'message'=>'user found',
                 'emailReset'=>$email
             ]);
       }
       return response()->json([
        'message'=>'هذا المستخدم غير مسجل لدينا',
       ]);
    }



   //reset password - receive values for password change
    public function resetPassword(Request $request)
    {
        $request->validate([
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);
       
       $newPass=Hash::make($request->password);
       $done= User::where('email',$request->emailReset)->update(['password'=>$newPass]);
       
       //response
       if($done){
            return response()->json([
                'message'=>'تم تعديل كلمة المرور'
            ]);
        }

    }



    //log the user in
    public function login(Request $request)
    {
    
     $validator = Validator::make($request->all(),[
        'email'     => 'required|string',
        'password'  => 'required|string'

      ]);
        //if wrong data
        if ($validator->fails()) {
            return response()->json(['message' =>'خطأ في البريد الالكتروني أو كلمة المرور']);
        }
        
        //attempt login
        $credentials    =   $request->only('email', 'password');
        if (! Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'بيانات الدخول غير صحيحة'
            ]);
        }

        //create token
        $user   = User::where('email', $request->email)->firstOrFail();
        $token  = $user->createToken('auth_token')->plainTextToken;
        
        $authData=[];
        $authData['token']=$token;
        $authData['token_type']='Bearer';

        return response()->json([
            'message'       => 'تم تسجيل الدخول بنجاح',
            'authData' => $authData,
        ]);
      
    }



    
    //show paid ads on homepage
    public function paidAds($key)
    {
       if($key==123){
          $data=Ad::where('feature',2)->orderBy('item_id','DESC')->get();
          return json_encode($data);
       }else{
          return json_encode(['msg'=>'You are not allowed']);
       }
    }



    //choose package
    public function package(Request $request)
    {
        $adDetail= Ad::where('item_id',$request->id)->first();
        $name=$adDetail->NAME;
        $feature=$adDetail->feature;

        //get name of category
        if($adDetail->CAT_ID==1){$cat='activities';}elseif($adDetail->CAT_ID==2){$cat='jobs';}
        elseif($adDetail->CAT_ID==3){$cat='products & services';} elseif($adDetail->CAT_ID==4){$cat='occasions';}
        elseif($adDetail->CAT_ID==5){$cat='wanted';} elseif($adDetail->CAT_ID==6){$cat='lost';}
        
        //status
        if($adDetail->approve==1){$status='shown';} else{$status='pending';}
        //chosenPlan
        $chosenPlan=$request->plan==1 ? 'GOLD' : 'SILVER';
        //user name
        $userName=User::where('id',$adDetail->USER_ID)->value('name');
        //pay method
        if($request->pay==1){$pay_method='vodafone';} elseif($request->pay==2){$pay_method='bank';}
        //price
        $price=$request->plan==1 && $feature==0 ? 300 : ($request->plan==1 && $feature==1 ? 150 : 150);
        // check if ad has roq in plan table
        $foundPlan= Plan::where('item_id',$request->id)->first();
        //sterilize phone field
        $phone=strip_tags($request->input('phone'));
        //prepare to insert
        $planTable=new Plan();
        //now
        $now=Carbon::now();


       //there's already a request to promote ad 
       if($foundPlan){ 
            return response()->json(['message'=>'تم تقديم طلب تمييز من قبل']);
           
       }else{  // no request made

              if($feature==0){ //ad has no plan
                    if($request->pay==1){ //vodafone cash
                        //insert in plan table
                        $planTable->item_id=$request->id;  $planTable->ad_cat=$cat;
                        $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
                        $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
                        $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
                        $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
                        $planTable->save();
                       // insertPlan($request->id,$cat,$adDetail,$status,$chosenPlan,$userName,$phone,$pay_method);
                        return response()->json(['success'=>'success', 'tameezPay' =>'vodafone', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                        
                    }elseif($request->pay==2){ //bank transfer
                        //insert in plan table
                        $planTable->item_id=$request->id;  $planTable->ad_cat=$cat;
                        $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
                        $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
                        $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
                        $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
                        $planTable->save();
                        return response()->json(['success'=>'success', 'tameezPay' =>'bank', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                
                    }elseif($request->pay==3){ //pay pal
                        return response()->json(['redirectPaypal' =>'redirectPaypal', 'price'=>$price ]);

                    }elseif($request->pay==4){ //visa 
                        return response()->json(['redirectVisa' =>'redirectVisa' ]);                
                    }

            }elseif($feature==1 && $request->plan==2){ //feature==1 means silver plan, $request->plan==2 means silver plan
                return response()->json(['message'=>'مميز بالفعل بالباقة الفضية']);
           
            }elseif($feature==1 && $request->plan==1){ //feature==1 means silver plan, $request->plan==1 means gold plan(with silver plan but wants gold plan)
                    //  /
                    if($request->pay==1){ //vodafone cash
                        //insert in plan table
                        $planTable->item_id=$request->id;  $planTable->ad_cat=$cat;
                        $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
                        $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
                        $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
                        $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
                        $planTable->save();
                        return response()->json(['success'=>'success', 'tameezPay' =>'vodafone', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                        
                    }elseif($request->pay==2){ //bank transfer
                        //insert in plan table
                        $planTable->item_id=$request->id;  $planTable->ad_cat=$cat;
                        $planTable->ad_title=$adDetail->NAME; $planTable->ad_date=$adDetail->item_date;
                        $planTable->ad_status=$status; $planTable->ad_chosenplan=$chosenPlan;
                        $planTable->ad_username=$userName; $planTable->ad_userphone=$phone;
                        $planTable->pay_method=$pay_method;  $planTable->order_date=$now;
                        $planTable->save();
                        return response()->json(['success'=>'success', 'tameezPay' =>'bank', 'tameezPlan' =>$request->plan, 'tameezPhone' => $phone, 'tameezName'=>$name, 'tameezPrice'=>$price ]);
                
                    }elseif($request->pay==3){ //pay pal
                        return response()->json(['redirectPaypal' =>'redirectPaypal', 'price'=>$price  ]);

                    }elseif($request->pay==4){ //visa 
                        return response()->json(['redirectVisa' =>'redirectVisa' ]);                
                    }
           
            }elseif($feature==2 && $request->plan==1 || $feature==2 && $request->plan==2){ //feature==1 means silver plan, $request->plan==2 means silver plan
                return response()->json(['message'=>'مميز بالفعل بالباقة الذهبية']);
            }
        }

    }




    //searched ads
    public function search(Request $request)
    {
       //if($key==123){
       // $data=  DB::select('SELECT * from ads limit 12') ;
       $adsPerPage = 9; // Number of ads per page
       $pageNum=$request->Page ? $request->Page : 1;
       $startFrom = ($pageNum - 1) * $adsPerPage;// Starting point for pagination


       if( $request->countryValue>0 && $request->stateValue>0  && $request->cityValue>0){
        // Fetch paginated results using raw SQL query with Laravel DB facade
            $data = DB::select("
                SELECT *
                FROM ads
                JOIN categories ON categories.cat_id = ads.CAT_ID 
                JOIN sub ON ads.subcat_id = sub.subcat_id 
                JOIN country ON ads.country_id = country.country_id
                LEFT JOIN state ON ads.state_id = state.state_id
                LEFT JOIN city ON ads.city_id = city.city_id
                WHERE country.country_id = :country_id
                AND state.state_id = :state_id
                AND city.city_id = :city_id
                AND categories.cat_id > 0
                AND sub.subcat_id > 0
                AND ads.approve = 1 
                ORDER BY feature DESC, item_id DESC  
                LIMIT :startFrom, :adsPerPage
            ", [
                    'country_id' => $request->countryValue,
                    'state_id' => $request->stateValue,
                    'city_id' => $request->cityValue,
                    'startFrom' => $startFrom,
                    'adsPerPage' => $adsPerPage
            ]);

            // Optionally, get the total number of ads if you need it for pagination or other logic
            $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue,'city_id'=> $request->cityValue]) ->where('approve', 1)->count();
            

      }elseif( $request->countryValue>0 &&  $request->stateValue>0  && $request->cityValue==0){
        // Fetch paginated results using raw SQL query with Laravel DB facade
       $data = DB::select("
            SELECT *
            FROM ads
            JOIN categories ON categories.cat_id = ads.CAT_ID 
            JOIN sub ON ads.subcat_id = sub.subcat_id 
            JOIN country ON ads.country_id = country.country_id
            LEFT JOIN state ON ads.state_id = state.state_id
            LEFT JOIN city ON ads.city_id = city.city_id
            WHERE country.country_id = :country_id
            AND state.state_id = :state_id
            AND city.city_id > 0
            AND categories.cat_id > 0
            AND sub.subcat_id > 0
            AND ads.approve = 1 
            ORDER BY feature DESC, item_id DESC  
            LIMIT :startFrom, :adsPerPage
       ", [
            'country_id' => $request->countryValue,
            'state_id' =>  $request->stateValue,
            'startFrom' => $startFrom,
            'adsPerPage' => $adsPerPage
      ]);

      // Optionally, get the total number of ads if you need it for pagination or other logic
      $adsTotalNumber = DB::table('ads')->where(['country_id'=> $request->countryValue,'state_id'=> $request->stateValue]) ->where('approve', 1)->count();
       

     } elseif( $request->countryValue>0 && $request->stateValue==0 && $request->cityValue==0){
        // Fetch paginated results using raw SQL query with Laravel DB facade
       $data = DB::select("
            SELECT *
            FROM ads
            JOIN categories ON categories.cat_id = ads.CAT_ID 
            JOIN sub ON ads.subcat_id = sub.subcat_id 
            JOIN country ON ads.country_id = country.country_id
            LEFT JOIN state ON ads.state_id = state.state_id
            LEFT JOIN city ON ads.city_id = city.city_id
            WHERE country.country_id = :country_id
            AND state.state_id > 0
            AND city.city_id > 0
            AND categories.cat_id > 0
            AND sub.subcat_id > 0
            AND ads.approve = 1 
            ORDER BY feature DESC, item_id DESC  
            LIMIT :startFrom, :adsPerPage
      ", [
            'country_id' => $request->countryValue,
            'startFrom' => $startFrom,
            'adsPerPage' => $adsPerPage
     ]);

       // Optionally, get the total number of ads if you need it for pagination or other logic
       $adsTotalNumber = DB::table('ads')->where('country_id', $request->countryValue) ->where('approve', 1)->count();

     } 
    
     if(empty($data)){
            $data=[];
            $msg='لا توجد نتائج بحث';
            $adsTotalNumber=0;
            $response = [
                'data' => $data,
                'free'=>'لافتات مجانية ',
                'msg'=>$msg,
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                ];
            return response()->json($response);
       }else{
            $response = [
                'data' => $data,
                'div' => ($adsTotalNumber/9),
                'free'=>'لافتات مجانية ',
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                ];
            return response()->json($response);       
       }
    
                    
    }//end search





    //get states
    public function states(Request $request)
     {
        if ($request->cont > 0 ) {
            $data = DB::select("
                SELECT state.*, country.* FROM state
                JOIN country ON country.country_id = state.country_id
                WHERE country.country_id = :country
            ", ['country' => $request->cont]);

            return response()->json($data); // Ensure JSON response
        }
        $data=[];
        return response()->json($data); // Handle invalid input
     }




     //get cities
    public function cities(Request $request)
    {
        if ($request->state > 0 ) {
            $data = DB::select("
                SELECT state.*, city.* FROM city
                JOIN state ON state.state_id = city.state_id
                WHERE state.state_id = :state
            ", ['state' => $request->state]);

            return response()->json($data); // Ensure JSON response
        }
        //  $data=[];
        //  return response()->json($data); // 
    }




    //get cats
    public function cats(Request $request)
    {
        $data = DB::select("
            SELECT * FROM categories
        ");
        return response()->json($data); // Ensure JSON response
    }



    //get subcats
    public function subcats(Request $request)
    {   
        if ($request->id > 0 ) {
            $data = DB::select("
                    SELECT * FROM sub
                    JOIN categories ON sub.cat_id = categories.cat_id
                    WHERE categories.cat_id = :cat
                ", ['cat' => $request->id]);
            return response()->json($data); // Ensure JSON response
        }
    }



    //get countries
    public function conts(Request $request)
    {
        $data = DB::select("
            SELECT * FROM country
        ");
        return response()->json($data); // Ensure JSON response
    }


    //add




    






}//end
