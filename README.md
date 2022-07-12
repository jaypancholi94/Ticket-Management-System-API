# Ticket Management System - API

## About

Ticket Management System(TMS) is developed using Node.js and express. This project manages users using Java Web Token(JWT). It has mainly three components/entities at the moment which are Users, Boards, and Tickets. Boards and users(team) will be managed my higher level users such as Super admins and Board Managers (please refer below table for user access permissions). Ticket will be part of board where tickets can be raised, which has two states at the moment open and resolved. TMS uses sequelize (mysql) for database.

|               | Super Admin | Board Manager | User | Boards | Tickets |
| ------------- | ----------- | ------------- | ---- | ------ | ------- |
| Super Admin   | CRUD        | CRUD          | CRUD | CRUD   | CRUD    |
| Board Manager | -           | R             | CRUD | CRUD   | CRUD    |
| User          | -           | -             | -    | -      | CRU     |

Please contact me on [jaypancholi94@gmail.com](mailto:jaypancholi94@gmail.com) for postman endponts file.

## Available Scripts

In the project directory, you can run:

### `npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Future Updates

Ticket Management System will implements Roles, which gives power to Super admin so they can defined custom roles and permissions. Forgot password, and User registration yet tobe developed.
