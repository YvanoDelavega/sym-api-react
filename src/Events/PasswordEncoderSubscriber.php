<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\HttpKernel\Event\KernelEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface
{
    /** @var UserPasswordEncoderInterface */
    private $encoder;

    public function __Construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents()
    {
        // https://api-platform.com/docs/core/events/
        return [
            KernelEvents::VIEW => ['EncodePassword', EventPriorities::PRE_WRITE]
        ];
    }

    /**
     * https://symfony.com/doc/current/reference/events.html#kernel-events
     *
     * @param GetResponseForControllerResultEvent $event
     * @return void
     */
    public function EncodePassword(ViewEvent $event)
    {
        $result = $event->getControllerResult();
        
        $method = $event->getRequest()->getMethod();
    
        

        if ($result instanceof User && $method === 'POST') {
            // ici $result etst forcément un User
            $hash = $this->encoder->encodePassword($result, $result->getPassword());
            $result->setPassword($hash);
        }
    }
}
