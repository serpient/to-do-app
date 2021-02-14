# [To Do App Live Link](https://goofy-lewin-c61122.netlify.app)

## Quick Start

Create a `.env.local` file and add the api key:

```
REACT_APP_API_KEY=XXXX_API_KEY_HERE
```

```bash
git clone https://github.com/serpient/to-do-app.git
cd to-do-app
yarn install

# Start application
yarn start

# Jest Test
yarn run test

# Cypress E2E test
yarn run test:e2e
```
## Screenshots

#### Happy State
![successful load](https://p23.f4.n0.cdn.getcloudapp.com/items/4gu11WQb/3cbcda0e-4f65-4703-b5c4-203081982d9a.jpg?v=95b460fa9bd8a547bf38c8cab4833c1f)

#### Updating
![updating flow](https://p23.f4.n0.cdn.getcloudapp.com/items/5zuAAvZd/9d6f2d8e-fc0e-487c-bec9-b36bf63b67b1.gif?v=25e51fe32691a7addb16c900248f6c0f)

#### Error State
**Easiest way to trigger this is to comment out the API_KEY (line 28) in the `/to-do-app/src/utils/todoRequest.ts` file**
![error state](https://p23.f4.n0.cdn.getcloudapp.com/items/6quQQXKR/f12002a8-8318-4a27-865d-33b733ba73f9.jpg?v=7afb87c601f67c874f2b93fe4dc41c08)
