<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ad;
use App\Models\User;
use App\Models\Category;
use App\Models\subCategory;
use App\Models\Comment;
use App\Models\ReplyComment;
use App\Models\Country;
use App\Models\State;
use App\Models\City;
use App\Rules\countryPhone;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; //put or delete files
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;








class apiAds extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    public function user(Request $request)
    {
        if($request->user()->email_verified_at==null){
            return response()->json([
             'message'       => 'verify your email',
             'name'       => $request->user()->name,
             'email'       => $request->user()->email
            ]);
     
         }
        return response()->json([
            'name'        => $request->user()->name,
            'email'       => $request->user()->email,
            'admin'       => $request->user()->admin
           ]);
    }
    

     
     // display ads by a certain user
    public function userAds(Request $request)
    {  
        $adsPerPage=6; 
        $pageNum=$request->Page ? $request->Page : 1;
        $startFrom = ($pageNum - 1) * $adsPerPage;// Starting point for pagination
        $USERID=User::where('email',$request->email)->value('id');

        $ads=DB::select("
        Select * from ads where USER_ID= :userId
        ORDER BY feature DESC, item_id DESC  
        LIMIT $startFrom, $adsPerPage
        ",[
            'userId'=>$USERID,
        ]);

         // get the total number of ads 
         $adsTotalNumber = DB::table('ads')->where(['USER_ID'=>$USERID])->count();
          $response=[
              'ads'=>$ads,
              'div' => ($adsTotalNumber/6),
              'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
              'page'=>$pageNum
          ];
          return json_encode($response);
    }


    // display ads for a certain user (in user profile)
    public function userSearchAds(Request $request)
    {  
        $adsPerPage=6;
        $pageNum=$request->Page ? $request->Page : 1;
        // Starting point for pagination
        $startFrom = ($pageNum - 1) * $adsPerPage;
        // gwt user id
        $USERID=User::where('email',$request->email)->value('id');
        //decide search value
        $search=$request->searchVal==='waiting'?'waiting':'featured';
        
        //search for waiting approval ads
        if($search==='waiting'){
            $ads=DB::select("
            Select * from ads where USER_ID= :userId
            AND approve=0
            ORDER BY feature DESC, item_id DESC  
            LIMIT :startFrom, :adsPerPage
            ",[
                'userId'=>$USERID,
                'startFrom' => $startFrom,
                'adsPerPage' => $adsPerPage
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['USER_ID'=>$USERID,'approve'=>0])->count();
         
         //search for featured ads
        }else{
            $ads=DB::select("
            Select * from ads where USER_ID= :userId
            AND feature > 0
            ORDER BY feature DESC, item_id DESC  
            LIMIT :startFrom, :adsPerPage
            ",[
                'userId'=>$USERID,
                'startFrom' => $startFrom,
                'adsPerPage' => $adsPerPage
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['USER_ID'=>$USERID])->where('feature','>',0)->count();
        }
       if(empty($ads)){
            $response=[
                'ads'=>$ads=[],
                'div' => ($adsTotalNumber/6),
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                'page'=>$pageNum,
                'msg'=>'لا توجد نتائج بحث'
            ];
            return json_encode($response);
       }
        $response=[
            'ads'=>$ads,
            'div' => ($adsTotalNumber/6),
            'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
            'page'=>$pageNum
        ];
        return json_encode($response);
    }

    //checkAdOwner
    public function checkAdOwner($email,$id)
    {  
        //get commentor id
        $commentor=User::where('email',$email)->first();
        //get ad owner id
        $owner=Ad::where('item_id',$id)->first()->USER_ID;
        if($commentor->id===$owner&&$commentor->admin===''){
           return response()->json([
               'found'=>'owner'
           ]);
        }
    }


    //check if ad has comments
    public function checkComments(Request $request)
    {   
        //count comments
        $num=Comment::where('ITEM_ID',$request->id)->count();
        if($num>0){
           return response()->json([
               'num'=>$num
           ]);
        }
        return response()->json([
            'num'=>$num=0
        ]);
    }

    //insert  a new comment
    public function insertComment(Request $request)
    {  
       //check if commentor isn't deleted
       $found=User::where('email',$request->email)->first();
       if(!$found){
          return response()->json(['error'=>'fail']);
       }
       //get ad owner
       $adOwner=Ad::where('item_id',$request->item)->first()->USER_ID;
       //prevent if owner of the ad===commentor and not an admin
       if($adOwner===$found->id&&$found->admin==''){
          return response()->json(['error'=>'fail']);
       }
      //get commentor id
      $commentor=$found->id;
      $validator=Validator::make($request->all(),[
        'comment'=>['string','min:1','max:700']
      ]);
       //if error, send error message
      if($validator->fails()){
         return response()->json(['error'=>'fail']);
      }
      $date=date('Y-m-d');
       //insert a new comment in comments table
      $adCom=new Comment();
        $adCom->c_text=$request->comment;
        $adCom->c_date=$date;
        $adCom->ITEM_ID=$request->item;
        $adCom->commentor=$commentor;
        $adCom->rate=$request->rate;
        $adCom->owner=$request->owner;
      $adCom->save();

      //update comments & rates for this ad
      $numOfComments=Comment::where('ITEM_ID',$request->item)->count();//count comments
      $sumOfRates=Comment::where('ITEM_ID',$request->item)->sum('rate');//get rates total
      $rating=$sumOfRates/$numOfComments;//divide to get rating
      //update number of comments and rating for this ad
      Ad::where('item_id',$request->item)->update(['comments'=>$numOfComments,'rating'=>$rating]);
      //return response
      return response()->json([
          'ok'=>'ok'
      ]);
    }

    
    //get comments for a certain ad
    public function getAddComments(Request $request)
    {   
       $item=Comment::where('ITEM_ID',$request->id)->orderBy('c_id','DESC');
       $comments=$item->get();
       $count=$item->count();
       //
       $cids=$comments->pluck('c_id');
       $repliesToTheseComments=ReplyComment::whereIn('c_id',$cids)->get();

       if($comments){
            return response()->json([
                'comments'=>$comments,
                'replies'=>$repliesToTheseComments,
                'count'=>$count
            ]);
       }else{
            return response()->json([
                'comments'=>$nocomments=[]
            ]);
       }
    }

    //submit Reply to comment
    public function submitReply(Request $request)
    {  
        $validator=Validator::make($request->all(),[
             'reply_text'=>'required|string|min:1'
        ]);
        //date
        $now=Carbon::now();
        $user=User::where('email',$request->email)->first()->id;
        //insert data in comment2 table
       if (!$validator->fails()) {
          $reply=new ReplyComment();
            $reply->text=$request->reply_text;
            $reply->date=$now;
            $reply->commentor=$user;
            $reply->item_id=$request->item;
            $reply->c_id=$request->c_id;
          $reply->save();
          //gather replies to this old comment to count & get them
          $prepare=ReplyComment::where('c_id',$request->c_id);
          $count=$prepare->count();
          $replies=$prepare->get();
          if($count>0){
              return response()->json([
                  'replies'=>$replies,
                  'count'=>$count
              ]);
          }

       }
    }


    //get cat and subcat 
    public function getCatSubcat(Request $request)
    { 
        //get category
      $cat=Category::where('cat_id',$request->cat)->first()->nameAR;
      //get subcategory
      $subcat=SubCategory::where('subcat_id',$request->sub)->first();
      $sub=$subcat?$subcat->subcat_nameAR:'';
      //send data
      return response()->json([
          'cat'=>$cat,
          'sub'=>$sub
      ]);
    }


    //get cat and subcat 
    public function getCountryStateCity(Request $request)
    { 
        //get country
      $country=Country::where('country_id',$request->country)->first()->country_nameAR;
      //get state
      $state=State::where('state_id',$request->state)->first()->state_nameAR;
      //get city
      $city=City::where('city_id',$request->city)->first()->city_nameAR;
      //send data
      return response()->json([
          'country'=>$country,
          'state'=>$state,
          'city'=>$city
      ]);
    }


    //get more
    public function moreAds(Request $request)
    {   
        //number of ads on each page
        $adsPerPage=6;
        $pageNum=$request->Page ? $request->Page : 1;
        // Starting point for pagination
        $startFrom = ($pageNum - 1) * $adsPerPage;
        //store parameter
        $param=$request->param && $request->param!==''?$request->param:'';
        
        if($param==='country'){
            $found=Country::where('country_id',$request->paramVal)->first();
            $ads=DB::select("
                select * from ads where country_id = :value
                ORDER BY feature DESC, item_id DESC  
                LIMIT  $startFrom, $adsPerPage "
            , [
            'value'=>$request->paramVal  
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['country_id'=>$request->paramVal ])->count();
       }elseif($param==='state'){
            $found=State::where('state_id',$request->paramVal)->first();
            $ads=DB::select("
                select * from ads where state_id = :value
                ORDER BY feature DESC, item_id DESC  
                LIMIT  $startFrom, $adsPerPage "
            , [
            'value'=>$request->paramVal  
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['state_id'=>$request->paramVal ])->count();
        }elseif($param==='city'){
            $found=City::where('city_id',$request->paramVal)->first();
            $ads=DB::select("
                select * from ads where city_id = :value
                ORDER BY feature DESC, item_id DESC  
                LIMIT  $startFrom, $adsPerPage "
            , [
            'value'=>$request->paramVal  
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['city_id'=>$request->paramVal ])->count();
        }elseif($param==='cat'){
            $found=Category::where('cat_id',$request->paramVal)->first();
            $ads=DB::select("
                select * from ads where CAT_ID = :value
                ORDER BY feature DESC, item_id DESC  
                LIMIT  $startFrom, $adsPerPage "
            , [
            'value'=>$request->paramVal  
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['CAT_ID'=>$request->paramVal ])->count();
        }elseif($param==='sub'){
            $found=subCategory::where('subcat_id',$request->paramVal)->first();
            $ads=DB::select("
                select * from ads where subcat_id = :value
                ORDER BY feature DESC, item_id DESC  
                LIMIT  $startFrom, $adsPerPage "
            , [
            'value'=>$request->paramVal  
            ]);
            // get the total number of ads 
            $adsTotalNumber = DB::table('ads')->where(['subcat_id'=>$request->paramVal ])->count();
        }

        $noAds=[];
        //$show=$found->city_nameAR;
        if($ads && $found){
            return response()->json([
                'ads'=>$ads,
                'div' => ($adsTotalNumber/6),
                'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
                'page'=>$pageNum,
                'show'=>$param==='city'?$found->city_nameAR:($param==='state'?$found->state_nameAR:($param==='country'?$found->country_nameAR :($param==='cat'? $found->nameAR :($param==='sub'? $found->subcat_nameAR:''))))
            ]);
        }else{
            return response()->json([
                'ads'=>$noAds,
                'show'=>'no'
            ]);
        }
    }



    //get cat name of ads
    public function getCat( $cat)
    {
      $name=Category::where('cat_id',$cat)->value('nameAR');
      return response()->json([
          'name'=>$name
      ]);
     // return $name;
    }


     //get subcat of ads
     public function getSub( $sub)
     {
       $name=subCategory::where('subcat_id',$sub)->value('subcat_nameAR');
       return response()->json([
           'name'=>$name
       ]);
     }

    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    
    //  Store  newly created ads
    public function store(Request $request)
    {  
       // $request->phone=trim($request->phone);
        $validated=$request->validate([
            'titleValue' => ['required','string','min:4','max:40'],
            'catValue' => 'required|integer|not_in:0',
            'subValue' => 'required|integer|not_in:0',
            'countryValue' => 'required|integer|not_in:0',
            'stateValue' => 'required|integer|not_in:0',
            'cityValue' => 'required|integer|not_in:0',
            'photoValue'=>'required|image|mimes:jpg,jpeg,png|max:500|min:1',
            'phone'=> ['required', 'numeric'  ],//
            //optional 
            'whats'=>'nullable|numeric',
            'web'=>'nullable|url:http,https',
            'emailSocial'=>'nullable|email',
            'youtube'=>'nullable|url:http,https',          
            
        ]);
        

        if(!$validated){
            return response()->json(['msg'=>'not validated ']);
        }
        
        //img
       $img=$request->file('photoValue');
       $fileName=$img->getClientOriginalName();
       $exploded=explode('.',$fileName);
       $ext= strtolower(end($exploded));
       $newPhoto=rand(0,1000000000000).'.'.$ext;
       $img->storeAs('public/images',$newPhoto);

        // values ok and validated
        $USERID=User::where('email',$request->email)->value('id');
        $admin=User::where('id',$USERID)->value('admin');
        $approve=$admin !=''?1:0;

        $added=new Ad();
        $added->NAME=strip_tags($request->input('titleValue'));
        $added->CAT_ID= $request->catValue;
        $added->subcat_id= $request->subValue;
        $added->country_id= $request->countryValue;
        $added->state_id= $request->stateValue;
        $added->city_id= $request->cityValue;
        $added->photo= $newPhoto;
        $added->USER_ID= $USERID;
        $added->approve= $approve;
        //optional
        $added->phone= strip_tags($request->input('phone'));
        $added->website= strip_tags($request->input('web'));
        $added->item_email= strip_tags($request->input('emailSocial'));  
        $added->whatsapp= strip_tags($request->input('whats'));
        $added->youtube= strip_tags($request->input('youtube'));

        $added->save();
         
        if($added){
            return response()->json(['msg'=> 'تمت الاضافة بنجاح']);
         }

         
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
    
    
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }




    /**
     * Update ads
     */
   
    public function update(Request $request, string $id)
{
 
    $USERID=User::where('email',$request->email)->value('id');
    $admin=User::where('id',$USERID)->value('admin');
    $approve=$admin !='' ? 1 : 2;
     
    $validate=$request->validate([
        'title' => 'nullable|string|max:40|min:5',
        'phone'=> 'nullable' ,
        'whats'=> 'nullable',
        'web'=> 'nullable|url:http,https',
        'emailSocial'=> 'nullable|email',
        'youtube'=> 'nullable|url:http,https'

    ]);

 if($validate){ 

     //check if file has image
     $adTable= Ad::where('item_id',$id)->first();
     $ad=Ad::where('item_id',$id);

       //if item exists
       if($adTable){
        
           //check request->file
           if($request->file('file')){
               //validate file
              $validate=$request->validate(['file' => 'image|mimes:jpg,jpeg,png|max:500|min:1',]);
              
              if($validate){
                    $fileToAdd=$request->file('file');
                    // Generate real file name
                    $fileName = $fileToAdd->getClientOriginalName();
                    //explode fileName to get extension
                    $ext=explode('.',$fileName);
                    $realExt=end($ext);
                    $newPhoto=rand(0,10000000000000).'.'.$realExt;
            
                    // Get old image
                    $oldPhoto = Ad::where('item_id', $request->id)->value('photo');
            
                    // Delete old image if it exists 
                    if ($oldPhoto) {
                        $oldImgPath = 'public/images/' . $oldPhoto;
                        Storage::delete($oldImgPath);
                    }     
                         
                    // Store new image
                    $fileToAdd->storeAs('public/images', $newPhoto);
                    // Add new photo to update data
                    $ad->update(['photo'=>$newPhoto]);
                }
            }

            //update fields if found
            if($request->title){$ad->update([ 'NAME'=> strip_tags($request->input('title'))]);}             
            if($request->phone){ $ad->update([ 'phone'=> strip_tags($request->input('phone'))]);}
            if($request->whats){ $ad->update([ 'whatsapp'=> strip_tags($request->input('whats'))]);}
            if($request->emailSocial){ $ad->update([ 'item_email'=> strip_tags($request->input('emailSocial'))]);}
            if($request->web){ $ad->update([ 'website'=> strip_tags($request->input('web'))]);}
            if($request->youtube){ $ad->update([ 'youtube'=> strip_tags($request->input('youtube'))]);}
            $ad->update(['approve'=>$approve]);
            
            return response()->json(['message' => 'تم التعديل بنجاح']);//      
        }
    }                   
}

    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {   
        $found=Ad::where('item_id',$id)->first();
        if($found){
            Ad::where('item_id',$id)->delete();
            return response()->json(['message'=>'Item deleted successfully',]);
        }
        return response()->json(['message'=>'Item not found',]);
    }

    
}
