<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\Ad;
use App\Models\User;
use App\Models\Category;
use App\Models\subCategory;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Rules\countryPhone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; //put or delete files
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;


class panelController extends Controller
{
    
    public function index(Request $request)
    {   
        //store query
        $page=$request->query('page',1);
         //get all ads ['*']
        $ads=Ad::paginate(10,['*'],'page',$page);
        // return ads as json
        return response()->json($ads);
    }


    public function names(Request $request)
    {  
        
        $country=Country::whereIn('country_id',$request->country)->pluck('country_nameAR','country_id');
        $state=State::whereIn('state_id',$request->state)->pluck('state_nameAR','state_id');
        $city=City::whereIn('city_id',$request->city)->pluck('city_nameAR','city_id');
        $cat=Category::whereIn('cat_id',$request->cat)->pluck('nameAR','cat_id');
        $subCat=SubCategory::whereIn('subcat_id',$request->subCat)->pluck('subcat_nameAR','subcat_id');
        $user=User::whereIn('id',$request->user)->pluck('name','id');



        return response()->json([
            'country'=>$country,
            'state'=>$state,
            'city'=>$city,
            'cat'=>$cat,
            'subCat'=>$subCat,
            'user'=>$user


        ]);

        /*
        $ads=Ad::whereIn('item_id',$request->ids)->get();
        $country=Country::whereIn('country_id',$ads->country_id)->value('country_nameAR');
        $state=State::whereIn('state_id',$ads->state_id)->value('state_nameAR');
        $city=City::whereIn('city_id',$ads->city_id)->value('city_nameAR');

        return response()->json([
            'country'=>$country,
            'state'=>$state,
            'city'=>$city
        ]);
        */

    }







}
