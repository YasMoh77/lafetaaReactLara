<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class countryPhone implements ValidationRule
{
    
    public $country;
    public $phone;

    public function __construct($country)
    {
       $this->country=$country;
      // $this->phone=$phone;
    }
    
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
      if(empty($value)){
          return;
      }
           
       if($this->country==1  && isset($value) && ($value>=0 && $value<11) || $value>11){
            $fail(' أدخل 11 رقم');
       }elseif($this->country==2 && ($value>=0 && $value<10) || $value>10){
            $fail(' أدخل 10 رقم');
        }elseif($this->country==3 && ($value>=0 && $value<8) || $value>8){
            $fail(' أدخل 8 رقم');
       }elseif($this->country==4 && ($value>=0 && $value<10) || $value>10){
            $fail(' أدخل 10 رقم');
       }elseif($this->country==5 && ($value>=0 && $value<8) || $value>8){
            $fail(' أدخل 8 رقم');
       }elseif($this->country==6 && ($value>=0 && $value<8) || $value>8){
            $fail(' أدخل 8 رقم');
       }

    //  }
    }
}
