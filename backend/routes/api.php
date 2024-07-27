<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\apiController;
use App\Http\Controllers\apiAds;
use App\Http\Controllers\paypalController;
//use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Crypt;


//show and search 
Route::group([],function () {
    Route::get('home/{key}',[apiController::class,'paidAds']);  
    Route::post('search',[apiController::class,'search']); 
    //countries, states and cities
    Route::get('conts',[apiController::class,'conts']);  
    Route::post('states',[apiController::class,'states']); 
    Route::post('cities',[apiController::class,'cities']); 
    //categories & subcategories
    Route::get('cats',[apiController::class,'cats']); 
    Route::post('subcats',[apiController::class,'subcats']);  
    //login
    Route::post('login',[apiController::class,'login']); //
    //sign up
    Route::post('register',[RegisteredUserController::class,'store']); 
    //user clicks on email link to verify email after register
    Route::get('verify/{email}',[apiController::class,'verify']);
    //user requests new verification email
    Route::post('send-verify',[apiController::class,'sendVerify']);
    //check if verirfied or not
    Route::post('check-verify',[apiController::class,'checkVerify']);
    //user requested to change password
    Route::post('request-reset',[apiController::class,'requestReset']);
    //receive values for password change
    Route::post('reset-password',[apiController::class,'resetPassword']);
    //receive values for password change
    Route::post('package',[apiController::class,'package']);

 });

 //ads
 Route::group(['prefix'=>'ads'],function(){
    //add new ads
    Route::get('/',[apiAds::class,'index']);
    //get certain user ads
    Route::post('/user',[apiAds::class,'userAds']);
    Route::post('store',[apiAds::class,'store']); 
    Route::get('/cat/{cat}',[apiAds::class,'getCat']);
    Route::get('/sub/{sub}',[apiAds::class,'getSub']);
    //update ads
    Route::post('update/{id}',[apiAds::class,'update'])->middleware('auth:sanctum'); //update certain user ads

 });

//get user data on logging 
Route::get('/user',[apiAds::class,'user'])->middleware(['auth:sanctum']);

/*pay pal*/
Route::get('paypalPayment/{plan}/{price}/{id}/{phone}',[paypalController::class,'paypalPayment'])->name('paypalPayment');
Route::get('paypalSuccess', [paypalController::class,'paypalSuccess'])->name('paypalSuccess');
Route::get('paypalCancel', [paypalController::class,'paypalCancel'])->name('paypalCancel');

/*Route::get('do',function(){
  $a='cancel';
  echo $a.'<br>';
 $crypt= Crypt::encrypt($a);
  echo $crypt.'<br>';

});*/