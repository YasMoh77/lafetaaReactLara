<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ad;
use App\Models\User;
use App\Models\Category;
use App\Models\subCategory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage; //put or delete files
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;







class apiAds extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ads=Ad::all();
       return json_encode($ads);
    }


    public function user(Request $request)
    {
        if($request->user()->email_verified_at==null){
            return response()->json([
             'message'       => 'verify your email',
             'name'       => $request->user()->name,
             'email'       => $request->user()->email
            ]);
     
         }
        return $request->user();
    }
    
     
     // display ads by a certain user
     
    public function userAds(Request $request)
    {  
        $adsPerPage=9;
        $pageNum=$request->Page ? $request->Page : 1;
        $startFrom = ($pageNum - 1) * $adsPerPage;// Starting point for pagination
        $USERID=User::where('email',$request->email)->value('id');

        $ads=DB::select('
        Select * from ads where USER_ID= :userId
        ORDER BY feature DESC, item_id DESC  
        LIMIT :startFrom, :adsPerPage
        ',[
            'userId'=>$USERID,
            'startFrom'=>$startFrom,
            'adsPerPage'=>$adsPerPage,
        ]);

         // get the total number of ads 
         $adsTotalNumber = DB::table('ads')->where(['USER_ID'=>$USERID])->count();
          $response=[
              'ads'=>$ads,
              'div' => ($adsTotalNumber/9),
              'adsNum' => 'عدد الاعلانات: '.$adsTotalNumber,
              'page'=>$pageNum
          ];
          return json_encode($response);

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
        $validated=$request->validate([
            'titleValue' => ['required','string','min:5','max:40'],
            'catValue' => 'required|integer|not_in:0',
            'subValue' => 'required|integer|not_in:0',
            'countryValue' => 'required|integer|not_in:0',
            'stateValue' => 'required|integer|not_in:0',
            'cityValue' => 'required|integer|not_in:0',
            'photoValue'=>'required|image|mimes:jpg,jpeg,png|max:500|min:1'
            
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
        $approve=$admin=='ok'?1:0;


        $added= Ad::create([
            'NAME'=> strip_tags($request->input('titleValue')),
            'CAT_ID'=> $request->catValue,
            'subcat_id'=> $request->subValue,
            'country_id'=> $request->countryValue,
            'state_id'=> $request->stateValue,
            'city_id'=> $request->cityValue,
            'photo'=> $newPhoto,
            'USER_ID'=> $USERID,
            'approve'=>$approve

         ]);
         
        if($validated){
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
    $approve=$admin=='ok'?1:2;

   //validate title if exists
   if($request->title){
        $validate=$request->validate([
            'title' => 'nullable|string|max:40|min:5',
        ]);

        //report error msg if something is wrong
        if(!$validate){
            return response()->json(['message'=>'watch errors with title']);
        }

         //check if title is not empty
        $titleToAdd=$request->title ? strip_tags($request->title):'';
       if($titleToAdd!=''){
          Ad::where('item_id', $id)->update(['NAME'=>$titleToAdd,'approve'=>$approve]);
          return response()->json(['message' => '<i class="bi bi-check-circle-fill fs-2 "></i>']);
       }     
    }

   //validate file if exists
   if($request->file('file')){
        $validate2=$request->validate([
            'file' => 'image|mimes:jpg,jpeg,png|max:500|min:1'
        ]);

        //report error msg if something is wrong
        if(!$validate2){
            return response()->json(['message'=>'watch errors with img']);
        }
        
        //check if file has image
        $fileToAdd=$request->file('file') ? $request->file('file'):'';
        if($fileToAdd!=''){
          $found=Ad::where('item_id', $id)->first();

          //if item exists
          if($found){
                // Generate real file name
                $fileName = $fileToAdd->getClientOriginalName();
                //explode fileName to get extension
                $ext=explode('.',$fileName);
                $realExt=end($ext);
                $newPhoto=rand(0,10000000000000).'.'.$realExt;
        
                // Get old image
                $oldPhoto = Ad::where('item_id', $id)->value('photo');
        
                // Delete old image if it exists
                if ($oldPhoto) {
                    $oldImgPath = 'public/images/' . $oldPhoto;
                    Storage::delete($oldImgPath);
                }
        
                // Store new image
                $fileToAdd->storeAs('public/images', $newPhoto);
        
                // Add new photo to update data
                Ad::where('item_id', $id)->update(['photo'=>$newPhoto,'approve'=>$approve]);
                return response()->json(['message' => '<i class="bi bi-check-circle-fill fs-2 "></i>']);
    
             }

        }    
   }    
  
}

    
   
     /* public function update(Request $request, string $id)
    {   
        //store request values
        $title=$request->title;
        $file=$request->file('file');

        //validate
        if($title){
            $validatedTitle=$request->validate([
                'title'=>'max:100|nullable',
            ]);

             //update
             Ad::where('item_id',$id)->update(['NAME'=>$title]);

        }

        if($file){
            $validatedFile=$request->validate([
                'file'=>'image|mimes:jpg,jpeg,png|max:500|min:1|nullable'
            ]);

            //get extension
            $file=$request->file('file');
            $fileName=$file->getClientOriginalName();
            $ext=explode('.',$fileName);
            $realExt=end($ext);
            $newPhoto=rand(0,10000000000000).'.'.$realExt;

            //get old image
            $old=Ad::where('item_id',$id)->value('photo');

            //delete old image
            $oldImg='public/images/'.$old;
            storage::delete($oldImg);

            //store
            $file->storeAs('public/images',$newPhoto);

            //update
            Ad::where('item_id',$id)->update(['photo'=>$newPhoto]);
            return response()->json(['msg'=>$newPhoto]);

        }
     

    }*/

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
