# Table of Contents
- [Overview](#overview)
  - [Notes to Reviewers](#notes-to-reviewers)
- [Prerequisites](#prerequisites)
- [Running Locally](#running-locally)
  - [Initialization](#initialization)
  - [Local API](#local-api)
  - [Local DB](#local-db)
  - [Local UI](#local-ui)
- [General Discussion](#general-discussion)
  - [Technical Decisions](#technical-decisions)

# Overview
This is a simple medication management application designed to help
users keep track of their medications and scheduled dosages. It's responsive 
across all breakpoints and built with a focus on simplicity and usability.

## Notes to Reviewers
- Things I prioritized:
  - Type safety between client and server
    - tRPC + zod was used to achieve this
  - Developer experience
    - Monorepo with yarn workspaces
    - Tanstack Query/Form for data fetching and form management
    - TailwindCSS + shadcn/ui for rapid UI development
    - Vite for fast dev server and builds
    - Containerized local DB for easy setup
    - Clear documentation
    - Simple scripts for development (everything can be run from the root with simple yarn commands)
- Things I would change with more time:
  - **Move shared zod validation logic to a common package**
    - After doing this, I would make `packages/api` only export the `AppRouter` type 
      - This is important to avoid potentially leaking server only logic to the client
  - More robust error handling and user feedback in the UI
  - More comprehensive unit tests for the API
  - Add CI/CD pipeline for automated testing and deployment
  - Implement real authentication/authorization
  - Add infrastructure as code for deploying to a cloud provider
  - Cleanup/enhance the caching strategy with Tanstack Query
  - Add prettier/eslint for consistent code style across the monorepo

# Prerequisites
- `node >=22.0.0`
- `AWS SAM CLI`
  - [Installation Instructions](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions)
  - Don't concern yourself with AWS credentials/config for this project, as we are only running locally
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

**That's it. Everything else is explained below.**

# Running Locally

## Initialization
**From the root of the project**
1. Run `corepack enable`
   - This enables the required `yarn` version
2. Run `yarn install`
3. Ensure Docker Desktop is running

## Local API
**From the root of the project**
1. Run `yarn api:build`
   - This builds the API package
   - `WARNING:` Any time you make changes to the API code, you must re-run this command before starting the local server
2. Run `yarn api:dev` to start the API server locally

## Local DB
**From the root of the project**
- Run `yarn db`
- To stop/remove from Docker run `yarn db-stop`

## Local UI
**From the root of the project**
- Run `yarn ui` to start the UI locally


# General Discussion

### Technical Decisions
- ##### Monorepo with `yarn workspaces`
  -  **Why a monorepo?**  
      - Easier local development experience
      - Shared dependencies are deduped automatically
      - Easier to manage versioning across packages
      - Simplified CI/CD pipelines (when added later)
      - Very clean with `tRPC`
    - **Unfortunate tradeoffs**
      - Slightly more complex initial setup
      - Tooling support can be hit-or-miss (though yarn workspaces is widely supported now)
- ##### MongoDB
  - **Why MongoDB?**  
    - Flexible schema for evolving requirements
    - Good developer experience with tools like MongoDB Compass
    - Easy managed solution with MongoDB Atlas
    - Scales well with growing data needs
    - Under limited time constraints, it's nice to go with a familiar tool
  - **Unfortunate tradeoffs**
    - Not a relational DB, so joins are less performant
      - Not a big deal for this app since data relationships are simple
    - Transactions are more limited compared to relational DBs
    - Not as "serverless" friendly as other options (e.g., DynamoDB, Aurora Serverless)
- ##### tRPC
  - **Why tRPC?**  
    - End-to-end type safety between client and server
    - No need to manually define API schemas or codegen (e.g., OpenAPI/Swagger)
    - Simplified data fetching with hooks on the client side
    - Great developer experience with autocompletion and type inference
    - Integrates well with React and popular React libraries
  - **Unfortunate tradeoffs**
    - Tightly couples client and server code
      - This must be very carefully managed
    - Less mature ecosystem compared to REST/GraphQL
    - Difficult to find _great_ documentation (especially when working with newer packages like tanstack)
    - Can be overkill for very simple APIs
- ##### Tanstack Query/Form
  - **Why Tanstack?**  
    - Powerful and flexible data fetching and caching
    - Excellent developer experience with hooks and utilities
    - Great for managing server state in React applications
    - Tanstack Form provides robust form handling capabilities and pairs well with zod/tRPC
  - **Unfortunate tradeoffs**
    - Difficult to find _great_ documentation for more advanced use cases due to how new the packages are
- ##### TailwindCSS 
  - **Why TailwindCSS?**  
    - Utility-first approach allows for rapid UI development
    - Highly customizable and extensible
    - Encourages consistent design patterns
    - Great developer experience with JIT mode and IntelliSense support
  - **Unfortunate tradeoffs**
    - Initial learning curve for those unfamiliar with utility-first CSS
    - Can lead to verbose class names in JSX/HTML
- ##### ShadCN/UI
  - **Why ShadCN/UI?**  
    - Pre-built, and accessible out of the box
    - Because the components are copied into your own repo you can customize/extend them as needed
      - This must be done carefully to ensure they continue to play nicely with other shadcn components
    - Built on top of TailwindCSS, making it easy to integrate
    - Speeds up development with ready-to-use components
  - **Unfortunate tradeoffs**
    - Looks a bit generic
    - Requires careful management when customizing components to avoid breaking changes
- ##### Vite
    - **Why Vite?**  
        - Fast development server with instant hot module replacement (HMR)
        - Optimized build process for production
        - Excellent support for React and TypeScript
    - **Unfortunate tradeoffs**
        - Less mature than traditional bundlers like Webpack
        - Some plugins/loaders may not be available or fully compatible



### TODO
- ~~Add API routes for full medication mgmt functionality~~
  - ~~Create medication w/ schedule~~
  - ~~Read medication(s)~~
  - ~~Mark dosage as taken~~
  - ~~Mark medication as inactive~~
- ~~Add API unit tests~~
- ~~Add UI to view/manage medications~~
  - ~~View list of medications~~
  - ~~View upcoming dosages~~
    - ~~Ability to mark as taken~~
  - ~~Add medication w/ schedule~~
- ~~Document decisions/tradeoffs~~
- **Move all zod validation logic to a new workspace @packages/common**
  - Test zod validations there and mock in packages/api tests
- Enhance error handling for form submissions and failed data fetching

#### Maybe next time 🤷‍♂️
- Add prettier/eslint across the monorepo
- Extract hardcoded magic numbers/strings/etc
- Add CI/CD (GitHub Actions)
- Add `/infra` package for IaC (e.g., Terraform/Pulumi)
- Add actual authentication/authorization
- Add real care recipient context to UI

