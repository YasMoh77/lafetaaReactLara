<?php

namespace App\Providers;

use App\Events\RegisterEvent;
use App\Events\VerifyEvent;
use App\Listeners\RegisterListener;
use App\Listeners\RegisterVerifyListener;
use App\Listeners\VerifyListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [ 
     // Registered::class => [  SendEmailVerificationNotification::class,] ,
        RegisterEvent::class => [  RegisterListener::class,RegisterVerifyListener::class,] ,
        VerifyEvent::class =>   [  VerifyListener::class,] ,


    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
