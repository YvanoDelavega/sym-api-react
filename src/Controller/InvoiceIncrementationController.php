<?php 

namespace App\Controller;

use App\Entity\Invoice;
use Doctrine\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class InvoiceIncrementationController extends AbstractController {

    /**  @var ObjectManager */
    private $manager;

    public function __construct(ObjectManager $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(Invoice $data) // ne nom $data est obligatoire
    {
        $data->setChrono($data->getChrono() + 1);
        $this->manager->flush();

        return $data;
    }
}
