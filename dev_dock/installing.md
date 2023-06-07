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
rails webpacker:install
rails generate react_on_rails:install
```

Start the app: 
`./bin/dev` for Hot Module Reload (automatic page reload on bundle change)
`./bin/dev-static` for statically created bundles (no HMR)
