<?php

namespace App\DataFixtures;

use Faker\Factory;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\Persistence\ObjectManager;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * php bin/console doctrine:fixtures:load --no-interaction
 */

class AppFixtures extends Fixture
{
    /**
     * encode de mot de passe
     * @var UserPasswordEncoderInterface
     *
     * @var [type]
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $faker = Factory::create('fr_FR');


        // les utilisateurs
        //gestion des utilisateurs
        $users = [];
        $genres = ['male', 'female'];

        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $genre = $faker->randomElement($genres);
            $hash = $this->encoder->encodePassword($user, 'password');
            $user->setFirstName($faker->firstname($genre))
                ->setLastName($faker->lastname)
                ->setEmail($faker->email)
                ->setPassword($hash);

            $manager->persist($user);

            $chrono = 1;
            // on crée les clients
            for ($j = 0; $j <= mt_rand(5, 20); $j++) {

                $c = new Customer();
                $c->setFirstName($faker->firstName())
                    ->setLastName($faker->lastName())
                    ->setCompany($faker->company())
                    ->setUser($user)
                    ->setEmail($faker->email());
                $manager->persist($c);

                // on crée les factures des clients
                for ($h = 0; $h < mt_rand(3, 10); $h++) {
                    $v = new Invoice();
                    $v->setAmount($faker->randomFloat(2, 250, 5000))
                        ->setSentAt($faker->dateTimeBetween('-6 months'))
                        ->setStatus($faker->randomElement(['SENT', 'PAID', 'CANCELLED']))
                        ->setCustomer($c)
                        ->setChrono($chrono++);
                    $manager->persist($v);
                }
            }
        }




        $manager->flush();
    }
}
