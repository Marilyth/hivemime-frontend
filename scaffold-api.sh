swagger_url="https://api.mayiscoding.com/swagger/v1/swagger.json"
curl -o ./swagger.json $swagger_url
npx swagger-typescript-api generate --path ./swagger.json -o ./src/lib
rm ./swagger.json