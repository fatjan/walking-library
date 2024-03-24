# Walking Library

## Setup Instructions

1. **Copy Environment Template**: Start by copying the `.env-template` file and renaming it to `.env`. Fill in the necessary credentials and configuration values.

2. **Run the Application**: Execute the following command to run the application locally:

   ```
   npm run dev
   ```

3. **Run Tests**: To run tests for the application, use the following command:

   ```
   npm test
   ```

4. **Initialize the Database**: Initialize the database by running the following command:

   ```
   npx init
   ```

5. **Migrate Database Changes**: Whenever there are changes to be applied to the database schema, use the following command to migrate those changes:

   ```
   npx prisma migrate dev --name {changes-name}
   ```

Follow these setup instructions to properly configure and run the Walking Library application. Happy coding!
