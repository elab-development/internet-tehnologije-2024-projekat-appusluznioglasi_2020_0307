<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\User;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;


    protected function downloadAndStoreImage(): string
    {
        // ✅ Promenite ovaj deo
        // Koristite direktan i pouzdan link sa Picsum-a, koji daje nasumičnu sliku
        $imageUrl = 'https://picsum.photos/640/480/?random=' . rand(1, 1000); // Dodajemo rand za veći randomizaciju

        // 2. Preuzimanje sadržaja slike
        // PAŽNJA: Da bi file_get_contents funkcionisao, morate imati uključen 'allow_url_fopen' u php.ini
        $imageContent = file_get_contents($imageUrl);

        // ... ostatak koda ostaje isti ...
        $fileName = 'service_' . Str::uuid()->toString() . '.jpg';
        $destinationPath = 'services/' . $fileName;

        Storage::disk('public')->put($destinationPath, $imageContent);

        return $destinationPath;
    }

    public function definition(): array
    {
        $serviceNames = [
        'Dog Grooming','Dog Walking','Pet Sitting','Web Design','SEO Optimization','Photography Session','Home Cleaning','Social Media Marketing',
        'Personal Training','Yoga Classes','Cooking Lessons','Gardening Service','Interior Design','Event Planning','Car Detailing','Language Tutoring',
        'Music Lessons','Graphic Design','Mobile App Development','Custom Software Development','House Painting','Carpentry Work','Electrician Service','Plumbing Service',
        'Tax Consulting','Legal Consulting','Career Coaching','Resume Writing','Copywriting','Content Marketing','Video Editing','Virtual Assistant',
        'Translation Service','Proofreading','Editing Service','Logo Design','Brand Identity Creation','Online Advertising','E-commerce Setup','IT Support',
        'Cybersecurity Audit','Network Installation','Accounting Service','Bookkeeping','Financial Planning','Business Plan Writing','Market Research','Project Management',
        'Social Media Management','Influencer Marketing','Product Photography','Wedding Photography','Childcare','Elderly Care','Home Repairs','Appliance Repair',
        'Roofing Service','Window Cleaning','Laundry Service','Dry Cleaning Pickup','Courier Delivery','Personal Shopping','Styling Consultation','Hair Styling',
        'Makeup Artist','Massage Therapy','Reiki Healing','Chiropractic Service','Dog Training','Pet Grooming','Pet Photography','Landscaping','Snow Removal',
        'Pool Cleaning','Security System Installation','Smart Home Setup','Data Analysis','3D Modeling','Animation Service','UX/UI Design','Web Hosting Setup',
        'Email Marketing','Online Course Creation','Presentation Design','Voice Over Service','Podcast Editing','Public Speaking Coaching','Life Coaching','Diet Planning',
        'Meal Prep Service','Nutrition Consulting','Fitness Bootcamp','Dance Classes','Martial Arts Training','Driving Lessons','Photography Workshop','Catering Service',
        'Bakery Orders','Event Decor','Florist Service'
        ];
        return [
            'title'         => $this->faker->unique()->randomElement($serviceNames),
            'description'   => $this->faker->catchPhrase,
            'price'         => $this->faker->randomFloat(2, 10, 500),
            'max_employees' => $this->faker->numberBetween(1, 10),
        ];
    }


    public function forFreelancer(User $freelancer = null): static
    {
        return $this->state(function (array $attributes) use ($freelancer) {

            $freelancer = $freelancer ?: User::where('role', 'freelancer')->inRandomOrder()->first();

            return [
                'freelancer_id' => $freelancer?->id,
                'company_id'    => null,
                'max_employees' => 1,
                'image'=> $this->downloadAndStoreImage(),
            ];
        });
    }


    public function forCompany(Company $company = null): static
    {
        return $this->state(function (array $attributes) use ($company) {

            $company = $company ?: Company::inRandomOrder()->first();

            return [
                'company_id'    => $company?->id,
                'freelancer_id' => null,
                'image'=> $this->downloadAndStoreImage(),

            ];
        });
    }
}
