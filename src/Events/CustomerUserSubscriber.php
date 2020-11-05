<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class CustomerUserSubscriber implements EventSubscriberInterface
{

    /** @var Security */
    private $security;

    public function __Construct(Security $security)
    {
        $this->security = $security;
    }


    public static function getSubscribedEvents()
    {
        // https://api-platform.com/docs/core/events/
        return [
            KernelEvents::VIEW => ['setUserForCustomer', EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * https://symfony.com/doc/current/reference/events.html#kernel-events
     *
     * @param GetResponseForControllerResultEvent $event
     * @return void
     */
    public function setUserForCustomer(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ($result instanceof Customer && $method === 'POST') {
            // choppe l'utilisateur actuellement connecté
            $user = $this->security->getUser();
            // ici $result etst forcément un Customer            
            $result->setUser($user);
        }
    }
}
