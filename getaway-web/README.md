This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started with Backend

To get started with the backend create a file in the root directory `.env.local`
In this file write, the api key and secret can be found in `getaway/get_tickets.py`
```
AMADEUS_API_KEY='api_key_here'
AMADEUS_API_SECRET='api_secret_here'
```
With the api access set up ensure your are have a python virtual enviorment.
This can be created in VSCode by opening any python file. Once in the file go to the bottom right corner where it shows what version of python and click it. In the dropdown at the center of the screen click `+ Create Virtual Enviorment` and follow the steps. To activate the enviorment in terminal source path/to/.venv/scripts/activate. If the requirments.txt wasn't downloaded all ready download it manually using `pip install -r requirements.txt`

You can then run the flask server by running the command `python getaway-api.py` in the route directory. Note use a seperate terminal for this.

## Getting Started with Frontend

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
