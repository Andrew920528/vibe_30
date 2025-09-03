# Vibe 30: Quick Activity Generator

Vibe 30 is a web application that helps users discover and organize 30-minute activities. Users can create custom buckets of activities, randomly select activities when they're unsure what to do, and share their favorite activity collections with the community.

## Features

### Core Features

- **Activity Buckets**: Create and manage themed collections of 30-minute activities
- **Random Activity Generator**: Get a random activity suggestion from your selected bucket
- **User Accounts**: Save your buckets and activities across sessions
- **Community Sharing**: Share your activity buckets with other users

### User Flow

1. User creates an account/logs in
2. Creates custom buckets (e.g., "Outdoor Activities", "Learning", "Creative Projects")
3. Adds activities to their buckets
4. Can draw random activities from specific buckets
5. Option to share buckets with the community

## Technical Architecture

### Frontend (React + TypeScript)

- User authentication interface
- Bucket management dashboard
- Activity creation and management
- Random activity generator
- Community shared buckets browser

### Backend (Node.js + Express)

- RESTful API endpoints
- User authentication system
- Database management
- Activity randomization logic

### Database Schema

**Users**

- id (PK)
- username
- email
- password_hash
- created_at

**Buckets**

- id (PK)
- user_id (FK)
- name
- description
- is_public
- created_at

**Activities**

- id (PK)
- bucket_id (FK)
- name
- description
- estimated_duration
- created_at

## Development Setup

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
