<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\panelController;
use App\Http\Controllers\apiController;
use App\Http\Controllers\apiAds;
use App\Http\Controllers\paypalController;
//use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Support\Facades\Crypt;
use Carbon\Carbon;




//control panel
Route::group(['prefix'=>'panel'],function(){
   //count on dashboard
   Route::post('/count-dashboard', [panelController::class,'countDashboard']);
   //get all ads
   Route::get('/ads', [panelController::class,'ads']);
   //approve ad
   Route::post('/approve', [panelController::class,'approve']);
   //approve ad
   Route::post('/return-pending', [panelController::class,'returnPending']);
   //feature-ad
   Route::post('/feature-ad', [panelController::class,'featureAd']);
   //get users
   Route::get('/users', [panelController::class,'users']);
   //block users
   Route::post('/block', [panelController::class,'block']);
   //change admin
   Route::post('/change-admin', [panelController::class,'changeAdmin']);
   //delete user
   Route::post('delete/{id}',[panelController::class,'destroy']); //delete certain user 
   //get country,state,city,cat and subcat names
   Route::post('/names', [panelController::class,'names']);
   //get plan requests
   Route::get('/plans', [panelController::class,'plans']);
   //get plan requests
   Route::post('delete-plan/{id}', [panelController::class,'destroyPlan']);


});


//show and search 
Route::group([],function () {
   //get featured ads
    Route::get('home/{key}',[apiController::class,'paidAds']); 
    //add latest ads
    Route::get('/latest',[apiController::class,'latest']); 
    //search in homepage
    Route::post('search',[apiController::class,'search']); 
     //search in profile
    Route::post('searchWord',[apiController::class,'searchWord']); 
    //get countries, states and cities
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
    //save 
    Route::post('/save',[apiController::class,'saveAd']);
     // check if ad is saved or not
    Route::post('/checkSaved',[apiController::class,'checkSaved']);
     // get fields
    Route::post('/fields',[apiController::class,'fields']);
    // get favourites
    Route::post('/favourites',[apiController::class,'favourites']);

 });



 //ads
 Route::group(['prefix'=>'ads'],function(){
    //get certain user ads
    Route::post('/user',[apiAds::class,'userAds']);
    Route::post('store',[apiAds::class,'store']); 
    Route::get('/cat/{cat}',[apiAds::class,'getCat']);
    Route::get('/sub/{sub}',[apiAds::class,'getSub']);
    //update ads
    Route::post('update/{id}',[apiAds::class,'update']); //update certain user ads
    //delete ads
    Route::post('delete/{id}',[apiAds::class,'destroy']); //delete certain user ads
    //search certain user ads
    Route::post('/user-search',[apiAds::class,'userSearchAds']);
    //get category and subcategory for ads
    Route::post('/get-cat-subcat',[apiAds::class,'getCatSubcat']);
    //get country, state and city for ads
    Route::post('/get-country-state-city',[apiAds::class,'getCountryStateCity']);
    //get more ads when clicking on category, subcategory...etc
    Route::post('/more',[apiAds::class,'moreAds']);
    
    
 });


//get user data on logging 
Route::get('/user',[apiAds::class,'user'])->middleware(['auth:sanctum']); 

/*pay pal*/
Route::get('paypalPayment/{plan}/{price}/{id}/{phone}',[paypalController::class,'paypalPayment'])->name('paypalPayment');
Route::get('paypalSuccess', [paypalController::class,'paypalSuccess'])->name('paypalSuccess');
Route::get('paypalCancel', [paypalController::class,'paypalCancel'])->name('paypalCancel');

Route::get('do',function(){
    $now=Carbon::now();

  echo $now.'<br>';
 

});