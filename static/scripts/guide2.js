async function myOauthWorkflowDefinition(workflowCtx, portal) {
  return {
    "Step 1": {
      name: "Understand Login and OAuth Token",
      stepCallback: async () => {
        return workflowCtx.showContent(`## Introduction

This walkthrough showcases how to get access token to use CRS APIs.
          
## Getting Started

CRS APIs are protected by **OAuth 2.0**.
          
Before making any API requests, you must authenticate using your CRS credentials to retrieve an **Access Token**.
          
This token will be **automatically saved and reused** for all upcoming requests in this walkthrough.

`);
      },
    },

    "Step 2": {
      name: "Login to CRS and Set Access Token",
      stepCallback: async () => {
        return workflowCtx.showEndpoint({
          description: `Enter your CRS credentials to obtain an OAuth access token. This token will be saved for use in all following steps.`,
          endpointPermalink: "$e/CRS/User%20Login", // Replace with correct permalink
          verify: async (response, setError) => {
            if (response.StatusCode !== 200) {
              setError("Login failed. Please verify your credentials.");
              return false;
            }

            const accessToken =
              response?.data?.access_token ||
              response?.data?.accessToken ||
              response?.data?.token;

            if (!accessToken) {
              setError("Access token not found in response.");
              return false;
            }

            // Set globally so it's used in all future authenticated requests
            await portal.setConfig((defaultConfig) => ({
              ...defaultConfig,
              auth: {
                ...defaultConfig.auth,
                AuthorizationToken: {
                  ...defaultConfig.auth.AuthorizationToken,
                  AccessToken: accessToken,
                },
              },
            }));

            return true;
          },
        });
      },
    },

    "Step 3": {
      name: "What’s Next: Generate a Credit Report",
      stepCallback: async () => {
        return workflowCtx.showContent(`## You are now authenticated!

Next, you can generate a credit report using your new access token.

**[Get CRS Reports Walkthrough](page:api-recipes/guides)**  

## This guide walks you through:

- Ordering a credit report  
- Downloading a PDF version  
- Retrieving existing reports

If you're ready, [click here](page:api-recipes/guides) to continue.
        `);
      },
    },
  };
}
