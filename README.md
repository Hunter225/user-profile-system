# user-profile-system

## Description

This is a MERN stack example of user management system with JWT implementaion.

## Prerequisite

Before starting the application, please install the following prerequisite:

node 12
npm
Docker and Docker Compose
mongo shell\*

\*mongo shell can be installed by the following command with brew in MacOS:

```bash
brew tap mongodb/brew
brew install mongodb-community-shell
```

## Installation and Start

```bash
bash start.sh
```

The default backend port is 9000.
The default frontend port is 3000
The default db port is 27017.

The mongo docker will create a schema called 'aarini-assignment' and a root account with accoount name and password as "root".

## Notes

1. All api endpoints are protected by JWT except '/api/users/sign-in' and '/api/users/sign-up'.

2. The resiger page is "/register". After a user sign-up, his / her status is 'PENDING'. He / she need to be activated by an admin.

3. NO API endpoint is provided for creating admin user for security reason. It is assumed that the admin user can only be created by those who have DB access (e.g.: DevOps team). User the following command to create an admin user. The password of the following document is "Password1". It is hashed by bcrypt with factor 10. Please visit this [link](https://www.browserling.com/tools/bcrypt) to create a new admin password if needed.

```bash
mongo "mongodb://root:root@localhost:27017/aarini-assignment?authSource=admin"

db.users.insertOne({id:"4aa40b98-aa56-4ae0-98d2-f467bf84aac0", userName: "admin", password: "$2a$10$hEkRPJ.NeoTWQ2dVPE8vU.AuQGXQMmz5Z.syGMyxnJ/aro/L/L2AK", status: "ACTIVE", role: "ADMIN"})
```

4. Admin has the authority get user list, activate a user, and ban a user. The backend server will check the role of the JWT. It can be done in '/admin/user-list'

5. Base on the JWT of each user, he / she can only modify his / her own user profile. The backend server will check whether the id in JWT is the same as that of the modifying user profile.

6. Users with status 'PENDING' or 'BANNED' cannot get the JWT, and cannot proceed to "/user" page. (No JWT token generated in backend and no JWT returned)

7. After successful login in root directory ('/'), JWT will be stored in cookies. If the role is 'ADMIN', the browser will be directed to '/admin/user-list'. If the role is 'USER', the browser will be directed to '/user'.

8. Only JWT with 'ADMIN' role can enter '/admin/user-list' page. It ensures the normal user cannot access the admin page.

## API endpoints

Create a user:

```bash
curl -X POST \
  http://localhost:9000/api/users/sign-up \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: b8b58e32-4265-768c-6e0c-26d2fd090b8b' \
  -d '{
	"userName": "user130",
	"password": "Password1",
	"givenName": "give",
	"surName": "sur",
	"DOB": "20-06-2000"
}'
```

Sign-in and get JWT Token:

```bash
curl -X POST \
  http://localhost:9000/api/users/sign-in \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 946e10ed-77bf-183d-9663-a700594ce7df' \
  -d '{
	"userName": "user130",
	"password": "Password1"
}'
```

get user entity:

```bash
curl -X GET \
  http://localhost:9000/api/users/fa622795-7d5a-4c87-a64e-f3ecfc766f8c \
  -H 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhNjIyNzk1LTdkNWEtNGM4Ny1hNjRlLWYzZWNmYzc2NmY4YyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjIzMDg3NDAxLCJleHAiOjE2MjMwOTEwMDF9.nzEdH2CzQk-NwysUzwhDL_KULCrut7csUl1a8DEKwA4' \
  -H 'cache-control: no-cache' \
  -H 'postman-token: aeab56cc-506a-0f92-5490-314fb1acf859'
```

patch user entity (cannot patch status):

```bash
curl -X PATCH \
  http://localhost:9000/api/users/fa622795-7d5a-4c87-a64e-f3ecfc766f8c \
  -H 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImZhNjIyNzk1LTdkNWEtNGM4Ny1hNjRlLWYzZWNmYzc2NmY4YyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjIzMDg3NDAxLCJleHAiOjE2MjMwOTEwMDF9.nzEdH2CzQk-NwysUzwhDL_KULCrut7csUl1a8DEKwA4' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 178c7853-8387-25d2-9ebb-5fb09cb6985c' \
  -d '{
	"surName": "Hong",
	"givenName": "Kong",
	"DOB": "12-06-2019"
}'
```

get user list (only admin user can call):

```bash
curl -X GET \
  'http://localhost:9000/api/admin/users?page=1&limit=10&surName=userName&givenName=userName&status=ACTIVE%2CPENDING' \
  -H 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYTQwYjk4LWFhNTYtNGFlMC05OGQyLWY0NjdiZjg0YWFjMCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYyMzA4NzM4OSwiZXhwIjoxNjIzMDkwOTg5fQ.zUcZAhLJwBjfbpUquAca_IpK8eDBSVuC3UsYbVe1tf0' \
  -H 'cache-control: no-cache' \
  -H 'postman-token: 77aa34c4-320c-c30e-fa46-4d416a13212e'
```

patch user status (only admin user can call):

```bash
curl -X PATCH \
  http://localhost:9000/api/admin/users/421fb178-197b-46be-982a-1a0a1e8a9ae7 \
  -H 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRhYTQwYjk4LWFhNTYtNGFlMC05OGQyLWY0NjdiZjg0YWFjMCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTYyMjk5OTY2NywiZXhwIjoxNjIzMDAzMjY3fQ.euf-vCm6ayH3svslollmlAqB97A_qpbEdb8VAbSvJZo' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'postman-token: 0296fece-911e-6b58-072f-6562c4920ab2' \
  -d '{
	"status": "ACTIVE"
}'
```
