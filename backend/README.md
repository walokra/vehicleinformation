# trafi-ajoneuvotiedot backend

Serverless GraphQL API with Apollo running on Google Cloud Functions.

See: <https://www.apollographql.com/docs/apollo-server/deployment/gcp-functions/>

## Development

## Deploy to GCP

```
gcloud functions deploy trafi-ajoneuvotiedot-backend \
--allow-unauthenticated \
--entry-point main \
--region us-east1 \
--runtime nodejs14 \
--set-env-vars NODE_ENV=development \
--trigger-http
```
