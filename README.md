<div align="center">

  <img alt="GitHub last commit" src="https://img.shields.io/github/release-date/marknorrapscm/serverless-media-portal?style=flat-square">
  <img alt="GitHub" src="https://img.shields.io/badge/maintained-yes-green.svg?style=flat-square">
  <img alt="GitHub" src="https://img.shields.io/github/license/marknorrapscm/serverless-media-portal?style=flat-square">
  <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/marknorrapscm/serverless-media-portal?style=flat-square">

</div>

<p>&nbsp;</p>

<div align="center" style="text-align:center">
  <img src="https://i.imgur.com/iwJYyux.png" />
  <h1>Serverless Media Portal</h1>
</div>

### 🚀 What is this?
This repo contains the full stack for creating a private, password-protected website for sharing home videos with family. The project (and this accompanying article) aim to make the deployment as easy as possible, taking no more than 10-15 minutes.

![smp-demo.gif](smp-demo.gif)

#### Basic feature list:

* Upload videos and automatically generate thumbnails
* View counting and comments on videos
* User accounts with simple authentication that's easy for older family members to use
* Simple permissions system to control who can view what
* Full mobile support
* Works within AWS's free tier (or is at least very cheap; I'll talk more about that [here](#aws-costs))
* [Here's a few screenshots too](https://imgur.com/a/gje6XMa)

#### Table of contents

This article will be split up into four sections:

1. [Setup dev environment](#section-1)
2. [Configure and deploy the backend](#section-2)
3. [Build and deploy the frontend](#section-3)
4. [Technical details](#section-4) *(optional)*

If you have an AWS account, some basic coding experience and 10 minutes to spare, you are good to go.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

### Background

I wanted a private space to host videos that I could share with my family. After seeing a lack of options in this space, I built my own solution and eventually open sourced it. Significant effort has been made to make the project as easy to deploy as possible.

### Tech stack: the frontend

The frontend is built using React from the `create-react-app` starter.

### Tech stack: the backend

The AWS backend is created using [Serverless Framework](https://www.serverless.com/). All the assets are defined in the Serverless template, meaning we don't have to create anything - all we do is install Serverless, get an IAM key and deploy from a terminal. Moderate usage should keep us within the free tier. The backend is 100% serverless, created using S3, Dynamo, Cloudfront and Lambda.

### Limitations

This project is meant for sharing small videos; the maximum video size is 512MB and only `.mp4` is supported. It also doesn't compress the videos for you, so if you're recording directly from your phone I would recommend getting an app to compress the videos before uploading them here. Messaging apps like WhatsApp do a good job at compressing videos and that is the source of most of the videos I have personally uploaded.

### Upgrading from v1?

The release of v2 comes with some breaking changes. If you've already installed v1 (i.e. you set this up before February 2022) you can check the [upgrade guide](docs/upgrade-from-v1.md). It's easy to do and the changes in v2 mean we shouldn't have any breaking changes in future.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

<a name="section-1"></a>

##  💻 1. Setup dev environment

To get going we need to do three things: install [Serverless Framework](https://www.serverless.com/), create an IAM user for it to use and clone the project from the [Github repo](https://github.com/marknorrapscm/serverless-media-portal.git).

### 1.1 Install Serverless Framework

Serverless Framework's setup is widely documented but it's so easy I might as well show it here.

1. Open a terminal
2. Run `npm install serverless@^2.72.2 -g`

*N.B. Serverless Framework v3 was recently released and the project will implement it soon, but for now v2 is required.*

### 1.2 Create an IAM user for Serverless

In AWS, go to the IAM dashboard and select users:

![https://i.imgur.com/puQr6TX.png](https://i.imgur.com/puQr6TX.png)

Click "Add user", then enter a username and enable programmatic access:

![https://i.imgur.com/Ozo08Sr.png](https://i.imgur.com/Ozo08Sr.png)

Click "next", select "Attach existing policies directly" and select the "AdministratorAccess" policy:

![https://i.imgur.com/RdGknj1.png](https://i.imgur.com/RdGknj1.png)

Nothing more needs to be entered; click next until the account is created. Whenever we create an account with programmatic access, AWS automatically generate an access key for us. It is this access key and secret that we will supply to Serverless which allows it to operate under the account we've just created.

![https://i.imgur.com/HTMqfgn.png](https://i.imgur.com/HTMqfgn.png)

You will never be able to view the secret once this window is closed so keep it open for the next stage. If you do close it, you'll have to [create a new access key](https://www.youtube.com/watch?v=JvtmmS9_tfU). Keep them private and never commit them to source control.

### 1.3 Add IAM user to Serverless

Here we will add the access key and secret to Serverless. Go back to your OS's command line and run the following command:

>`serverless config credentials -p aws --key theAccessKeyIDFromAws --secret theSecretKey`

The `serverless` command calls the package we installed globally in step 1. The `config credentials` commands are for adding a new user and the `-p aws` parameter states that we're using AWS (SLS works with several cloud providers).

The `--key` should take the AccessKeyID from the previous window and the `--secret` the secret. Nothing fancy is going on here; all it does is store the key and secret in a file stored in `C:\Users\YourUserName\.aws`.

### 1.4 Clone project

With the Serverless Framework CLI setup, we can proceed with cloning the ServerlessMediaPortal project from Github.

I prefer to use [Fork](https://git-fork.com/) as my Git client, but the command line command is:

> `git clone https://github.com/marknorrapscm/serverless-media-portal.git`

This will pull down the project, which is a mono-repo containing both the frontend and the backend.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

<a name="section-2"></a>

##  🛫 2. Configure and deploy the backend

The project you just pulled down contains a `/frontend` and a `/backend` folder. Start by opening the `/backend` folder in your preferred development environment; in my case, [VSCode](https://code.visualstudio.com/).

With Serverless installed, we then need to:

1. Create a layer containing FFmpeg.
2. Add a reference to the layer to the backend's `env.yml` file
2. Deploy the backend as is

### 2.1 Create FFmpeg layer

We use FFmpeg to process our video uploads. As this project uses Lambdas, we need to supply this dependency as a Lambda layer. We're going to use a pre-made layer from the AWS Serverless Application Repository and supply the ARN to the `env.yml` file.

Open the [ffmpeg-lambda-layer repo](https://serverlessrepo.aws.amazon.com/applications/us-east-1/145266761615/ffmpeg-lambda-layer) and click "Deploy". This doesn't actually deploy anything, it just opens the template in the AWS Console. **Make sure you are still in your desired region. Clicking the deploy button in SAR has a habit of routing you to us-east-1.** Leave the default options, scroll to the bottom and click deploy:

![https://i.imgur.com/E3b0TaX.png](https://i.imgur.com/E3b0TaX.png)

This will create the layer in your desired region. If you go to "Layers" on the left and click the refresh button, you should see a layer in the list.

![https://i.imgur.com/nky4iK9.png](https://i.imgur.com/nky4iK9.png)

Copy the ARN (partially blurred out in the photo above) and paste it into line #4 of the `env.yml` file in the root of the backend project:

![https://i.imgur.com/B26ZLVD.png](https://i.imgur.com/B26ZLVD.png)

### 2.2 Deploy backend

In the `env.yml` file, on line #1, set the region you want to deploy to. By default it is set to `eu-west-1`.

Open a terminal inside the `/backend` folder. Before we do anything, run:

> `npm install`

...then, to deploy, run:

> `npm run deploy`

...this might take a few minutes but any future deploys will be quick; it is the initial setup of the CloudFront instances that is time consuming.

### 2.3 Update environment variables

Once the deploy completes, a task runs which prints out some information about the assets that were just created:

![https://i.imgur.com/joXSftI.png](https://i.imgur.com/joXSftI.png)

Three values are printed here; these values are used on the frontend and need to be set as environment variables in the frontend project. You *could* go to the AWS Console to get these values, but printing them to console saves you that trip.

Open the `frontend/.env` file and set the following variables:

* `REACT_APP_imageCloudfrontDomain` to `ImageCloudfrontDomain`
* `REACT_APP_videoCloudfrontDomain` to `VideoCloudfrontDomain`
* `REACT_APP_apiGatewayUrl` to `ApiGatewayUrl`

It should look like:

![https://i.imgur.com/RGZ8U4c.png](https://i.imgur.com/RGZ8U4c.png)

The backend is now active in AWS.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

<a name="section-3"></a>

## ⭐ 3. Build and deploy the frontend

With the frontend's environment variables set and the backend deployed, we are ready to build and deploy the frontend.

If you haven't already, navigate to the `/frontend` directory and run:

> `npm install`

Once that completes, run the frontend using:

> `npm run start`

With the environment variables setup, the frontend will point at the AWS assets we've just created in the backend. You should see a login screen:

<div style="text-align: center;">
    <img src="https://i.imgur.com/vwS3AJA.png" />
</div>

### 3.1 Create your user account

The authentication system is designed to be as easy as possible for older family members to use. For a deeper explanation, check the technical details section at the end.

When the backend is first deployed, it automatically creates a temporary admin user with the following credentials:

* **Name:** Temporary Admin User
* **Date of birth:** 01/01/0001
* **Password:** password

Log in with these credentials and you should see the empty UI:

![https://i.imgur.com/qijROYJ.png](https://i.imgur.com/qijROYJ.png)

Leaving this account in place is a security risk, so we will create an account with your real details and delete it after. To do this, click "Settings" in the main menu and then click the "Add User" button:

![https://i.imgur.com/cn8bOSK.png](https://i.imgur.com/cn8bOSK.png)

In the modal that appears, enter your name, date of birth and a password. Remember to select the `Admin` tag as this will be your account with administrator privileges.

<div style="text-align: center;">
    <img src="https://i.imgur.com/uXOpiIg.png" />
</div>

Click submit and the new user will be created. We now need to delete the temporary account to prevent anybody else from using it. The delete button (which was previously disabled) can now be clicked, so click it to delete the temporary account.

After deleting that account you should automatically be signed out. Here you can login as the new user you just created.

At this stage, the media portal is good to go.


### 3.2 Upload a video

In the main menu on the left, click "Upload".

This gives us a very basic upload page. Click "Browse" to select your video:

![https://i.imgur.com/LacFsLL.png](https://i.imgur.com/LacFsLL.png)

When the `.mp4` is selected, the upload will begin automatically. Remember you are limited to files <= 512MB in size. Once the video is selected it automatically begins uploading. Once the upload is complete, three thumbnails will be generated for you to choose from. 

Complete the rest of the fields and select whatever tags you want the video to be visible to. Right now we only have the `Admin` tag, so if you - the admin - want to be able to view it, make sure you select it! 

Click submit and the form should be uploaded. To do another video, click the "Clear form" button in the top right:

![https://i.imgur.com/OlhCsCN.png](https://i.imgur.com/OlhCsCN.png)

If you click "Home" in the main menu you should see the video listed with the thumbnail you selected:

![https://i.imgur.com/KDWLbtN.png](https://i.imgur.com/KDWLbtN.png)

### 3.3 How does tagging work?

Whenever you upload a video, you select tags for that video. Whenever you create a user, you assign tags to that user. Users can only see videos if that video contains a tag that they have been assigned.

The "Admin" tag is a special tag that lets you upload and edit videos and add/delete both tags and users.

Users provide the *authentication* to get into the app; tags provide the *authorization* which controls what each user can do within the app. Again, the goal with this is to be as simple as possible.

### 3.4 Building the frontend

You should now have the frontend running in your local environment. To create a production build, simply run this in `/frontend/`:

> `npm run build`

This will create a production build at `/frontend/build`:

<div style="text-align: center;">
    <img src="https://i.imgur.com/ECJUPwZ.png" />
</div>

The contents of `/build` are all you need to deploy for your site to work.

### A note on subdirectories

I personally run the media portal inside a sub-directory on my website. So, instead of users going to `https://www.mysite.com` and seeing the media portal, they go to `https://www.mysite.com/media`. To achieve this, simply edit the `homepage` value within the frontend's `package.json`. If you want `/media` to be the sub-directory, set it to `"homepage": "/media"` and the frontend will operate under the sub-directory.

### 3.5 Deploying the frontend

In order to make this useful to people it needs to be deployed to a webhost. Ideally, you'd have your own domain as well - it's not particularly easy telling your grandmother to go to https://XkU8BhnR4.europe.some-random-host.com.

This is really the end of the how-to portion of the tutorial as you can host this site anywhere you want. The app is entirely serverless, so all you need is a static host. There are countless options, but I'd recommend the following:

* S3 static web hosting
  * View the [deploy-to-s3 readme](docs/deploy-to-s3.md) for a demonstration of deploying to an S3 bucket.
* Netlify
  * This is what I use. I have several apps running under different sub-domains on my website so I manually deploy the whole lot using the Netlify CLI rather than adding them all to the CI/CD chain. 

It is important to note that, because this is a single page React app, directly linking to or refreshing on the `/watch` or `/settings` page will cause an error unless you correctly configure your host to redirect to `index.html`. This is simple but often overlooked; it is covered in the [deploy-to-s3 readme](docs/deploy-to-s3.md). This is an issue with all SPA's and isn't specific to this project.

<p>&nbsp;</p>

---

<p>&nbsp;</p>

<a name="section-4"></a>

## ⚙ 4. Technical details (for those interested)

Check the [technical details](docs/technical-details.md) document for further detail details, such as:

* How the authentication works
* Issues around AWS costs and the free tier
* Running the project offline and further development

Notice a bug or want to suggest a feature? Open an issue and I'll respond. Better yet, fork the project and contribute yourself. 

If you like the project make sure to drop a ⭐

