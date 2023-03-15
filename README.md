# Example Next13 App Deployment using CDKTF

This is a minimal example showing how to deploy a Next 13 application on Vercel via CDK for Terraform (cdktf) and the [official Vercel Terraform Provider](https://github.com/vercel/terraform-provider-vercel).

## Project setup

Follow these 4 easy steps in order to publish the Next13 app to your Vercel account:

1. Create an API token in the Vercel Dashboard as described on the [Vercel Docs](https://vercel.com/guides/how-do-i-use-a-vercel-api-access-token). Use the "Full Access" scope. The token name can be anything you want - however, it's recommended to use ‘terraform’ (_as mentioned [here](https://vercel.com/guides/integrating-terraform-with-vercel#set-up-terraform)_).
2. Create a `.env` file in the `deployment/` folder and add the token from the previous step as `VERCEL_API_TOKEN` to it (_as shown in [.env.example](./deployment/.env.example)_).
3. Run `pnpm install` to install all dependencies
4. Run `pnpm deploy` to deploy the app to Vercel.
