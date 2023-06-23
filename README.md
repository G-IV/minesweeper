# Want to see main in action??
Here is a link (I'm using AWS, I'm sure that is cheating) - https://main.d243ha0ct0jb3l.amplifyapp.com/

# Minesweeper
I want to build an app that users can use to play minesweeper.  
 - Game is playable, but you have to refresh the browser to reset the game.  So I'd call this the MVP
 - ToDo
    - Better styling
    - Options
      - Different styling (make the minefield larger)
      - Customize the field size + mine count
      - Right hand column to show rules/how-to/thoughts (maybe make it collapsible or some other option to hide it)
I want to have a hover-over feature for cleared cells that shows the odds for each surrounding, uncleared cell of that cell being a mine, and why.
I want to have a hover-over feature for uncleared cells that shows the odds of that cell being a mine, and why.
I want to have an auto-solve feature.

While this isn't hosted on AWS, one thing I would like to point out is that this app has been developed following a TDD process.  

The store currenly exists only in hte minefieldSlice.js file.  I used the newest Redux version to create this app, and I haven't dug into how using slices changes setting up the store.  


I'm just leaving the default readme material here at the bottom.
# Getting Started with Create React App and Redux

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# Notes to me
[Testing practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library#using-wrapper-as-the-variable-name-for-the-return-value-from-render)

[react-dev](https://react.dev/blog/2023/03/16/introducing-react-dev)