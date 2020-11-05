<?php

namespace App\Events;

use App\Entity\Invoice;
use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class InvoiceChronoSubscriber implements EventSubscriberInterface
{

    /** @var Security */
    private $security;
    /** @var InvoiceRepository */
    private $repository;

    public function __Construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }


    public static function getSubscribedEvents()
    {
        // https://api-platform.com/docs/core/events/
        return [
            KernelEvents::VIEW => ['setChronoForInvoice', EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * https://symfony.com/doc/current/reference/events.html#kernel-events
     *
     * @param GetResponseForControllerResultEvent $event
     * @return void
     */
    public function setChronoForInvoice(ViewEvent $event)
    {


        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Invoice && $method === 'POST') {
            // choppe l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            $result->setChrono($this->repository->findNextChrono($user));
           // dd($this->repository->findNextChrono($user));

            // ici $result etst forcément un Invoice            
            //$result->setUser($user);

            if (empty($result->getSentAt()))
            {
                $result->setSentAt(new \DateTime());
            }
        }
    }
}
