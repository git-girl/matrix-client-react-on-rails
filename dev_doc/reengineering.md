# Reengineering 

- so i had this setup: 
1. React client makes a request to controller 
2. controller creates a Sidekiq Job passing a channel name \ 
   Sidekiq performs MatrixClient sync \ 
   Sidekiq sends confirmation over the channel once its done AND \ 
   stores the serialized synced client in the Redis Cache \ 
3. React Client gets notification about your sync job is done \ 
   React Client might do more requests \ 
   Requests like list of rooms are then using the cache_key \
   Client data gets deserialized and stuff is done on it.

- Why: 
  - because just accessing the client sync made it blow up  
  - then it was necessary to retrieve the job data. 
  - that data needed to be serialized cuz redis cant handle complex objects 
    - i used redis because i felt its better then storing things in a database 
    - and serialization wasnt so bad

- Now i found out: 
  - Client.sync only blew up becasue of a bug in the gem 
  - Installing it from the main lets me stick to http requests

- What now: 
  - I can access the Client data directly in a controller
  - how am i going to store that client data across requests
    - redis cache?

  Session.create -> login 
    Store user info and vars in a User object 
    store the user object in the session 

  Session.sync -> @client.sync
    store the cache_key in the User Object 
    store the synced client in the Redis cache

  Session.rooms -> 
    unserialize the client in the controller -> dont need to do stuff in a job 
    anymore




