# README

## NOTICE 

This is not a good way to use matrix! (probably). 
Instead of using the client side matrix javascript sdk 
(you make the connections from your browser) 
this app works by having your browser make a connection to a server 
which then makes the connection to the matrix server and sends 
back the data to your browser. 
This is an unnecessary step and is only there because this is a contrived 
sample app but I didn't want to write a TODO app.    

Of course with using a client you always need to trust the client as its 
trivial to collect your data at some point. So maybe there is a use case 
in which you want to save resources and have a smaller javascript app
running. However this is most likely still not the way for you because 
this is pretty much a single page react app(TM) and thus isnt as light 
as it could be.

## Stuff 

- This is for me testing out and learning React on Rails  
  Notes i write can be found in `dev_doc/`

- [ ] set up locale 










Things you may want to cover:

* Ruby version
3.2.1

* System dependencies

* Configuration

- make sure you have a file `tmp/caching-dev.txt` 
  so that caching is enabled. 

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...
