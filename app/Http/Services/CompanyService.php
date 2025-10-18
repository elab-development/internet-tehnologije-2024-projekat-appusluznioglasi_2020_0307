<?php

namespace App\Http\Services;

use App\Models\Company;
use Illuminate\Http\Request;

class CompanyService
{
    public function addCompany(array $request):Company{
        $company = Company::create([
                'name'=>$request['name'],
                'description'=>$request['description']??null,
                'badge_verified'=>$request['badge_verified']??false,
                'user_id'=>$request['user_id'],
            'address' => $request['address'] ?? null,
            'latitude' => $request['latitude'] ?? null,
            'longitude' => $request['longitude'] ?? null,
            ]);
        return $company;

    }
    public function updateCompany(Company $company, array $request):Company{
         $company->update($request);
         return $company;
    }
    public function deleteCompany(Company $company):bool{
       return  $company->delete();
    }


    public function getCompanyByUserId(int $userId): ?Company
{
    return Company::where('user_id', $userId)->first();
}

}
