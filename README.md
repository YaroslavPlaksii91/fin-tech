# Underwriting Platform

The underwriting platform is a cloud solution that helps to automate and configure the underwriting process, the process a lender uses to take an in-depth look at your credit and financial background to determine if you're eligible for a loan

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone git@git.gdev.group:eloanwarehouse/frontend-underwriting.git
    cd frontend-underwriting
    ```

2. **Setup npm registry:**
   This project uses a custom private npm registry, so you should set it up. Create `.npmrc` file in the root directory, and add `@eloanwarehouse:registry` and your credentials to use that registry. You can find  instructions in the `@eloanwarehouse/frontend-core` package readme


3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run the project:**

    ```bash
    npm run dev
    ```

    Your project will be available at [http://localhost:3000](http://localhost:3000).

## Additional Commands

- `npm run build`: Builds the project for production.

- `npm run dev`: Starts the production server (after running `npm run build`).

- `npm run lint`: Uses ESLint to analyze and fix syntax and style errors in JavaScript and JSX files.

- `npm run prepare`: Uses Husky to initialize hooks in your project.

- `npm run pre-commit`: Uses lint-staged to run pre-commit operations on files staged for version control. Ensure you have Husky installed for the proper functioning of this hook.
