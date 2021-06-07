docker-compose up -d
cd api
npm install
nohup npm start &
cd ..
cd client
npm install
nohup npm start &
cd ..
