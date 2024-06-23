# Order Management System (OMS)

An Order Management System (OMS) using NestJS, Prisma ORM, and PostgreSQL.

## Installation Guide
1. **Clone the repository**
```bash
git clone https://github.com/kerollosy/oms
cd oms
```

2. **Environment Variables**
Create a .env file in the root directory of your project if it doesn't already exist. This file will hold your environment variables. At a minimum, it should contain the following:
```
DATABASE_URL=postgresql://<username>:<password>@postgres:5432/<database>
```

3. **Build and Run the Docker Containers**
Use Docker Compose to build and start your containers. Run the following command:
```bash
docker-compose up --build
```

### Running the Application
1. **Start the NestJS server**

```bash
npm start
```

2. **The application will be running at `http://localhost:3000`**

## API Documentation
After starting the application, you can access the Swagger API documentation at `http://localhost:3000/api`.