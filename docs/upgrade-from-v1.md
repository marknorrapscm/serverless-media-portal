## 🌎  Upgrading to v2 of Serverless Media Portal 

Version 2 of Serverless Media Portal comes with several improvements and breaking changes.

The move to v2 is easy. None of the data (videos, users, tags etc.) that you have already uplaoded will be lost.

### Breaking changes:

* serverless.yml
  * All environment variables are now stored in an `env.yml` file. 
    * Previously, you had to manually specify the video and image bucket names. This has been completely removed.
    * Similarly, the `serverless.yml` used to contain the FFmpeg ARN. This has been moved to the `env.yml` file.
    * The `stage` and `region` settings have also been moved to the `env.yml`.
  * The benefit of this is that future changes to the `serverless.yml` will not introduce breaking changes.


## Upgrade process

The following steps should take 5 minutes or less to complete.

### Step #1

* Go to your existing `serverless-media-portal/backend` directory and open the `serverless.yml` file.
* In the `custom` section, under line #11, copy the following variables:
  * `region`
  * `stage`
  * `ffmpegLayerArn`
  * `numberOfDaysToKeepLogsFor`
* Paste these into Notepad (or anywhere) to store them temporarily

### Step #2

* Go to your existing `serverless-media-portal/frontend` directory and open the `.env` file.
* As before, save the following variables somewhere for safe-keeping:
  * `REACT_APP_imageCloudfrontDomain`
  * `REACT_APP_videoCloudfrontDomain`
  * `REACT_APP_apiGatewayUrl`

### Step #3

* Pull the latest version of the `master` branch of the Serverless Media Portal project from GitHub.
  * You may have to discard changes you have in the `backend/serverless.yml` and `frontend/.env`. This is OK since you've backed up the environment variables.
  * If you get merge conflicts, always accept the new, incoming changes. We want to completely replace the contents.

### Step #4

* Open `serverless-media-portal/backend`
  * You should see a new `env.yml` file at the root of the backend project
    * Replace the variables you saved in Step #1 with the new entries in `env.yml`; none of the names have changed
* Open `serverless-media-portal/frontend`
  * Again, you'll see a `.env` file with a different format
  * Add the variables you saved from Step #2 into the new `.env` file; again, none of the names have changed
    * No functionality is being changed here; it's just tidying up the file to make things easier for people setting up for the first time

### Step #5

* Install the new dependencies
   * Run `npm install` in both backend and frontend

### Step #6

That's it! Just re-deploy the project and you're done.

* Run through the deploy process:
  * `npm run deploy` in the backend directory
  * `npm run build` in the frontend directory
    * Deploy to wherever you are hosting (Netlify, S3 etc.)