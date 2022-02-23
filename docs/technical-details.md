## ⚙ 4. Technical details (for those interested)

This section isn't necessary but it does explain some technical details.

### How does the auth work?

The idea behind the authentication is to make it as simple as possible for older family members that don't have the typical social accounts that might be available in an OAuth login. Rather than making them sign up (or allowing just anybody to create an account), *we* will create accounts for them and have them login with their name, date of birth and a common password that they can easily remember. The technicalities of the authentication is explained in greater detail in the technical section at the end.

We use custom authorizers within Lambda. These intercept every request and perform a check of your choosing; in our case, it reads a hash from the `Authorization` header from the request and checks that that hash exists in our `Users` table.

### What's in the `Authorization` header?

Whenever you enter your username, date of birth and password in the login screen, these three values are combined into a string - separated by slashes and with the whitespace. It ends up looking like this:

> `joebloggs/01011990/password`

A strong hashing algorithm (bcrypt) is then applied to this string and a hash is produced. This hash is held in the `Authorization` header of each request and uniquely identifies every user.

The hash is stored in local storage. There is endless debate online about storing information in local storage and it *does* seem to be inferior to using a secure cookie (I may change this in future). The frontend *is* pretty secure from XSS attacks though: React has built-in character escaping and no obscure packages are being used.

Auth systems are a deep dive and I am no expert, nor am I suggesting that this approach is suitable for large systems, but for a system of this scale it is viable.

### AWS costs

<a name="aws-costs"></a>

None of the AWS assets that we create have ongoing running costs; the cost of everything we have created is determined by the level of use. The DynamoDB and Lambda costs are so cheap (at this scale) that they're virtually free.

The asset types more likely to incurr costs are S3 and Cloudfront. Both of these services are covered by the AWS free tier but only for a year and have the following caps:

* 5GB of storage in S3 and 20,000 GET and PUT requests
* 50GB of data transfer out of Cloudfront

After the first year (or if you exceed these limits) you'll start getting charged. The prices vary per region but [S3 storage](https://aws.amazon.com/s3/pricing/) (in `eu-west-1`) is roughly $0.02 per GB. This isn't much of a concern if you're just uploading small videos.

Then there's [Cloudfront](https://aws.amazon.com/cloudfront/pricing/), which charges $0.085 in `eu-west-1` for every GB of data transferred out. If you've compressed your videos, 1GB is quite a lot. For WhatsApp levels of compression, one minute of video equals about 10MB, so 1GB - or $0.085 - will give you over 1.5 hours of streamed video.

In hindsight, Cloudfront and S3 are fairly pricey for the benefits they deliver to a project of this scale. An alternative storage provider may have worked out cheaper, but from my personal use I still have not been charged anything despite uploading ~100 videos and having several family members use the website. Your mileage may vary and I encourage you to check the AWS pricing pages.

### Stages and running offline

You will notice that the stage is hardcoded to `production` in the `serverless.yml` file. Normally, we'd use the `${opt:stage}` setting in Serverless that would use whatever stage is supplied as a parameter (e.g. `serverless deploy --stage dev`). However, there is a bug that means that the `runAfterDeploy` task that creates the temporary user and prints out the asset URLs does *not* pick up the stage whenever it is supplied as a parameter. It simply reads `undefined` no matter what you supply to it.

This is a sacrifice I've decided to make so that the `runAfterDeploy` task can run as intended. Most people won't be doing further development on this and will likely just have one instance - the production instance - rather than a dev instance for running offline. If you do want to run offline, you'd need to change the stage to `dev` and run a deploy so the S3 buckets exist in AWS. 