# Local Invocation of Lambda Functions

Ensure you have a default `testEvent.json` in `src/scripts/`. This file should contain a sample event that your Lambda function expects. The script will work automatically with any Lambda function defined in your CDK stack, making it perfect for a template repository.

## Creating the Default Test Event

1. Navigate to the `src/scripts/` directory.
2. Create a file named `testEvent.json`.
3. Populate it with a sample event structure. For example:

```json
{
  "detail": {
    "message": "Hello from EventBridge!"
  }
}
```

Make sure the structure matches what your Lambda function expects.

## Usage Examples

- **Use default test event**  
  Run the following command to invoke your Lambda function with the default test event:

  ```bash
  npm run invoke:local
  ```

- **Use custom test event**  
  If you want to test with a custom event, you can specify the path to your custom JSON file:

  ```bash
  npm run invoke:local:with-event ./my-custom-event.json
  ```

## Additional Notes

- Ensure that your Lambda function is properly defined in your CDK stack and that the necessary permissions are set up for local invocation.
- You can modify the `testEvent.json` file as needed to test different scenarios for your Lambda function.