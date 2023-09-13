# Minimalist Sales Lead Tracker Backend

NOTE: This was made for a coding assessment that was never even viewed by the company I was applying for :( but this can be used a template for a simple CRUD backend using MongoDB so enjoy :) 

This is the backend for a simple sales lead tracker that handles all the CRUD (Create, Read, Update, Delete) operations. This is a very basic, stripped down backend mainly used for evaluation and testing. This is built with Node.js using Express routes. This backend uses MongoDB with the moongoose driver. This project is structured using the MVC (Model, Viewer, Controller) design pattern with this backend implementing the Model and Controller aspect.

## Install

To install the backend on a server, make sure you have these prerequisite programs installed onto your server.

- Node.js 14 and above
- npm
- MongoDB 5.0 and above
- Git

Lookup any guides out there to install this software relating to your OS and development environment.

### Download Project

You can download this project by using the git clone command. Make sure you have proper authorization to use to this Git repository as it may ask for a username and password (or token).

`git clone https://github.com/dmorales22/minimalist-sales-lead-tracking-system-backend`

### Quick Start

Once the project is downloaded. Go to the directory of the project in your command line and run this command to install dependencies:

`npm install`

Then start up the server with this command:

`npm start`

If there are any errors, make sure you have the prerequisite software and any dependencies installed first.

### systemd service

If you want this server to run continuously in the background, you can create systemd service (Linux distros that use systemd only).

Let's first create the service by running this command:

`sudo nano /etc/systemd/system/minimalist-sales-lead-tracking-system-backend.service`

Then copy and paste this text below (change `WorkingDirectory` to where ever you downloaded the project):

```
[Unit]
Description=NodeJS backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/home/ubuntu/minimalist-sales-lead-tracking-system-backend
ExecStart=node server.js
StartLimitIntervalSec=30
StartLimitBurst=2
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then save and close the file.

You can start the server by running this command:

`sudo systemctl start minimalist-sales-lead-tracking-system-backend`

And to make sure the server starts at startup:

`sudo systemctl enable minimalist-sales-lead-tracking-system-backend`

You can view the status of the server using this command:

`sudo systemctl status minimalist-sales-lead-tracking-system-backend`

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`PORT` The port the server will run on. Any ports below 1024 will require root access. Please input only a number here.

Ex: 5001

`IS_AUTH` Boolean if there is authentication being used to connect to the database

Ex: 0 or 1

`MONGODB_USER` The user of the MongoDB

Ex: dev

`MONGODB_NAME` The name of the database you are trying to access to

Ex: DevDB

`MONGODB_SERVER` The URL or IP address of the database server

Ex: localhost:27012

`DB_PASSWORD` The password of the user to access the database server

Ex: devPass233xLc@

`CORSURL` An URL or IP address that has access to any routes of the backend. This is to prevent outside sources from running requests to any route of the server.

Ex: localhost:3000

### Sample .env

And of course, there's a sample .env file is included in this repo.

## Contributors

Here are the list of people have contributed to this repo:

- David Morales (dmoral1414@gmail.com)

## Copyright

© 2023 David Morales

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS," WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
