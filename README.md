## Open Sesame

### # Setup

To try this out in Monerium sandbox, head over to https://sandbox.monerium.dev

1. Set up a user
2. Connect wallet and get an IBAN
3. Go to the developers section and create an app
   - Make sure to grab the client*id and client_secret for the \_Client Credentials Authorization*

Grab a webhook you want to act on. In my case I created a webhook in my home assistant

- https://www.home-assistant.io/docs/automation/trigger/#webhook-trigger

Edit `src/index.ts` and put in your values for _clientId_, _clientSecret_ and _actionWebhookUrl_

### # Run

`npm install`

`npx ts-node src/index.ts`
