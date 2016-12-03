# Coloring Pages Alexa Skill

## Backend

We will use AWS lambda to run our javascript script.

### Create the lambda function

1. Go to your [AWS lambda console](https://console.aws.amazon.com/lambda)
1. Choose **blank function** on the new function blueprints menu
1. Setup the lambda trigger. Click on the dotted square and choose **Alexa Skill Kit**
1. Configure the function, you can leave the defaults and just change the following:

    - Name the function. *e.g. coloring-ages-skill*
    - Choose `Node.js 4.3` runtime
    - Choose a role name. *e.g. coloring-pages-skill*
    - Increase the timeout a little bit. *e.g. 10sec*

### Deploy lambda function

