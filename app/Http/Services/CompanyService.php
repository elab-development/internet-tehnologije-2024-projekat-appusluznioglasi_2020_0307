<?php

namespace App\Http\Services;

use App\Models\Company;
use Illuminate\Support\Facades\Request;

class CompanyService
{
    public function addCompany(array $request):Company{
        $company = Company::create(
            [
                'name'=>$request['name'],
                'description'=>$request['description'],
                'badge_verified'=>$request['badge_verified'],
                'user_id'=>$request['user_id'],
            ]
        );
        return $company;

    }
    public function updateCompany(Company $company, array $request):Company{
         $company->update([$request]);
         return $company;
    }
    public function deleteCompany(Company $company):bool{
       return  $company->delete();
    }

}
