# Installing React on Rails 

## Different React and Rails Setups

- there are like three different ways to use react with rails
  - rails as an api and react client fetches data 
  - integrated with webpacker 
  - using esbuild 

- it is true that this turbo+stimulus thing with rails is kind 
  of the rails way of getting the same behavior. But it depends 
  on tech stack etc. of course what skills do you have available.

## Setting up integrated with webpacker Approach 
- There is the gem `react_on_rails` that handles this nicely 

```
rails new NAME --javascript=webpack
bundle add shakapacker --strict
bundle add react_on_rails --strict
bundle add foreman # this dep is not in the docs
rails webpacker:install
rails generate react_on_rails:install
```

**Issue with formean**
- runnin `./bin/dev` errored because Profile not found 
  - just running `formean -f Procfile.dev` works though
  - // note i changed that to be the ./bin/dev content

Start the app: 
`./bin/dev` for Hot Module Reload (automatic page reload on bundle change)foreman
`./bin/dev-static` for statically created bundles (no HMR)


## Hello World
  - Include your webpack assets to your application layout.

      <%= javascript_pack_tag 'hello-world-bundle' %>

  - To start Rails server run:

      ./bin/dev # Running with HMR

    or

      ./bin/dev # Running with statically created bundles, without HMR

  - To server render, change this line app/views/hello_world/index.html.erb to
    `prerender: true` to see server rendering (right click on page and select "view source").

      <%= react_component("HelloWorldApp", props: @hello_world_props, prerender: true) %>

Alternative steps to run the app:

  - Run `rails s` to start the Rails server.

  - Run bin/webpacker-dev-server to start the Webpack dev server for compilation of Webpack
    assets as soon as you save. This default setup with the dev server does not work
    for server rendering

  - Visit http://localhost:3000/hello_world and see your React On Rails app running!

  - To turn on HMR, edit config/webpacker.yml and set HMR to true. Restart the rails server
    and bin/webpacker-dev-server. Or use Procfile.dev.
