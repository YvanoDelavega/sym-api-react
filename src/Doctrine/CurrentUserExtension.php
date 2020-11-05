<?php

namespace App\Doctrine;

use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Customer;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Security;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{

    /** @var Security */
    private $security;
    /** @var AuthorizationCheckerInterface */
    private $auth;

    public function __Construct(Security $security, AuthorizationCheckerInterface $checker)
    {
        $this->security = $security;
        $this->auth = $checker;
    }


    public function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        $user = $this->security->getUser();
        if (($resourceClass === Customer::class || $resourceClass === Invoice::class)
             && !$this->auth->isGranted('ROLE_ADMIN')
             && $user instanceof User) // si la personne est connectée !
        {

            $rootAlias = $queryBuilder->getRootAliases()[0];
            if ($resourceClass === Customer::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } else if ($resourceClass === Invoice::class) {
                $queryBuilder->join("$rootAlias.customer", "c")
                ->andWhere("c.user = :user");
            }
            $queryBuilder->setParameter("user", $user);
            // dd($queryBuilder);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);        
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);      
    }
}
