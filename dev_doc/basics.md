# Basics 

react_component("Name", props: @props, prerender: false)
- the prerender decides if true then server renders to html
  otherwise client side rendering
- check it out with noscript you do get more html sent with 
  prerender true, pretty cool stuff this client side rendering 
  - html brutalism cries, poor non modern device

Same old: 
- The workflow is defining data in the backend, 
- pass them using instance vars or partial locals 
React diff: 
- in the html.erb you react components 
  - these and their stuff like aditional css or js defined under 
    `app/javascripts/bundles/NAME/components` 
  - you need to register these components in the bundles and server bundles 
    ( the error msg is pretty clear that you need to check that though :)  ) 
  - are there generators for react components? No :(
  - the folder strucutre should be 
    ```
    - javascript 
      - bundles  
        - Bundlename 
          - components 
            - ComponentName 
              - Component 
              - Componenent Server 
              - Componenent CSS
    ```

## What to bundle 
"it depends"

- Identifying entry points (each thing directly rendered through a rails view) 
- Shared Dependencies 
- always watch out that bundle sizes don't grow to large. 

## Links 
- just do an `<a>` element its good to put the links in a constants 
  definition file though in the bundle

## Forms 
- build out the form with JSX
  - define some onSubmit event

- need to match the rails API 
  ``` js
  import request from 'axios'
  request.post('user', {user}, requestConfig);
  ```

## Props 

- defining PropTypes is good practice 
- using `const [stateName, setStateName] = useState(props.name)` to define
  states 
  - component rerenders on the `setState`
  - setState is async and might take a bit so you can run into errors when 
    doing things like :   
    ```js 
    const [user, setUser] = useState(null)
    setUser(userFromFormData);
    if (user) { 
    }
    ```
    - this would not trigger the if because the setUser is still running 
    - either use the form data or use the setState callback param
    ``` js
    setCount(prevCount => prevCount + 1, () => {
         console.log('Count has been updated:', count);
       });
    ```
- using `useEffect` to fetch stuff from an external thing is nice
  example: 
  ```js
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // NOTE: this retriggers when the serverUrl or roomId (Dependencies) changes
  ```

## ActionCable Snippet

  ```js 
  import consumer from "channels/consumer";

  useEffect(() => {
    const subscription = consumer.subscriptions.create("SyncChannel", {
      received(data) {
        if (data.message === "SYNCJOB_COMPLETE") {
          setSyncComplete(true);
          getRooms();
        }
      },
    });
    return () => {
      subscription.unsubscribe();
    };
  ```

## QUESTIONS: 
- where do i start putting all the requests that pile up in the App Component?
