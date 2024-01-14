# POSD

Welcome to the POSD App! 🎉 🎊 This repository contains the source code for our amazing application. 😇😇

## Table of Contents
- [Building the App](#building-the-app)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Running the App](#running-the-app)
- [Stopping the App](#stopping-the-app)
- [Accessing the Frontend](#accessing-the-frontend)

## Building the App

### Backend

To build the backend of the app, navigate to the `backend` directory using the following commands:

```bash
{
  cd backend
  sudo docker build . -t backend:latest
  cd ..
}
```
### Frontend

To build the frontend of the app, navigate to the `frontend` directory using the following commands:

```bash
{
  cd frontend
  sudo docker build . -t frontend:latest
  cd ..
}
```

## Running the App

To run the app, run within the app's directory the following command:

```bash
{
  sudo docker-compose -f docker-compose.yml up
}
```

## Stopping the App

To stop the app, run within the app's directory the following command:

```bash
{
  sudo docker-compose -f docker-compose.yml down
}
```

## Accessing the Frontend

To acces the frontend, type within the browser the following address: `http://localhost:4200/login`  or `http://your_internal_ip_address:4200/login`