# Underwriting Platform

The underwriting platform is a cloud solution that helps to automate and configure the underwriting process, the process a lender uses to take an in-depth look at your credit and financial background to determine if you're eligible for a loan

## Getting Started

1. **Clone the repository:**

    ```bash
    git clone git@git.gdev.group:eloanwarehouse/frontend-underwriting.git
    cd frontend-underwriting
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Run the project:**

    ```bash
    npm run dev
    ```

    Your project will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `pages/`: Location for Next.js pages.
- `components/`
- `constants/`
- `hooks/`
- `utils/`

## Technologies Used

- [Next.js]
- [TypeScript]
- [Material UI](https://mui.com/)

## Additional Commands

- `npm run build`: Builds the project for production.

- `npm run dev`: Starts the production server (after running `npm run build`).

- `npm run lint`: Uses ESLint to analyze and fix syntax and style errors in JavaScript and JSX files.

- `npm run stylelint`: Uses Stylelint to check styles in SCSS files for compliance with coding standards.

- `npm run dep-list`: Shows a list of installed dependencies, including only production dependencies, providing extended information.

- `npm run prepare`: Uses Husky to initialize hooks in your project.

- `npm run pre-commit`: Uses lint-staged to run pre-commit operations on files staged for version control. Ensure you have Husky installed for the proper functioning of this hook.
