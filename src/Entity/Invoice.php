<?php

namespace App\Entity;

use App\Entity\User;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\InvoiceRepository;
use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 * @ApiResource(
 *  subresourceOperations={
 *      "api_customers_invoices_get_subresource"={
 *          "normalization_context"= {"groups"={"invoices_subresource"}}
 *      }
 *  },
 * 
 * itemOperations={"get", "put", "delete", "increment"={
 *      "method"="post", 
 *      "path"="/invoices/{id}/increment", 
 *      "controller"="App\Controller\InvoiceIncrementationController", 
 *      "swagger_context"={
 *          "summary"="Incrémente une facture",
 *          "description"="Incrémente le chrno d'une facture donnée"
 *      }
 *     }
 *  },
 * 
 * attributes={
 *      "pagination_enabled"=false,
 *      "pagination_items_per_page" : 15,
 *      "order": {"amount":"desc"}
 *  },
 * normalizationContext={"groups"={"invoices_read"}},
 * denormalizationContext={"disable_type_enforcement"=true}
 * )
 * @ApiFilter(OrderFilter::class, properties={"amount", "sentAt"})
 */
class Invoice
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     */
    private $id;

    /**
     * @ORM\Column(type="float")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="le montant est obligatoire")
     * @Assert\Type(type="numeric", message="ce doit etre du numerique")
     */
    private $amount;

    /**
     * @ORM\Column(type="datetime")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\Type("\DateTimeInterface", message="La date doit etre au format YYY-MM-DD")
     * @Assert\NotBlank(message="la date doit être renseignée")
     */
    private $sentAt;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"invoices_read"})
     * @Assert\NotBlank()
     */
    private $customer;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     *  @Assert\NotBlank()
     *  @Assert\Choice({"SENT", "PAID", "CANCELLED"}, message="le status doit etre SENT, PAID ou CANCELLED")
     */
    private $status;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"invoices_read", "customers_read", "invoices_subresource"})
     * @Assert\NotBlank(message="le chrono est obligatoire")
     * @Assert\Type(type="integer", message="ce doit etre un integer")
     */
    private $chrono;


    /**
     * Undocumented function
     * @Groups({"invoices_read", "invoices_subresource"})
     *
     * @return User
     */
    public function getUser(): User
    {
        return $this->getCustomer()->getUser();
    }


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(/*float*/ $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?\DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(/*\DateTimeInterface */ $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(?Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(/*int*/ $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }
}
