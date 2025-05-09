async function myWorkflowDefinition(workflowCtx, portal) {
  return {
    "Step 1": {
      name: "Order Credit Report (CRS Standard Format)",
      stepCallback: async (stepState) => {
        return workflowCtx.showEndpoint({
          description: `This endpoint returns a JSON credit report in the CRS Standard Format.
          
The {config} is a query string with which you can request various configurations of a credit report that are configured for your account by CRS.`,
          endpointPermalink: "$e/CRS%20Standard%20Format/New%20CRS%20Standard%20Format%20Equifax%20Credit%20Report%20Request", // Example permalink
          verify: (response, setError) => {
            if (response.StatusCode !== 200) {
              setError("Failed to order credit report. Please check your request and try again.");
              return false;
            }
            return true;
          },
        });
      },
    },

    "Step 2": {
      name: "Generate CRS Report - PDF",
      stepCallback: async (stepState) => {
        const step2State = stepState?.["Step 1"];
        console.log("Step 2 ", step2State);
        if (!step2State) {
          return workflowCtx.showContent(`⚠️ Unable to find RequestID from Step 1. Please complete Step 1 successfully before proceeding.`);
        }
        await portal.setConfig((defaultConfig) => {
          return {
        ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description:
            "This endpoint is used to generate CRS report through credit Report ID.",
          endpointPermalink: "$e/CRS%20Standard%20Format/Generate%20CRS%20Standard%20Format%20Credit%20Report%20PDF%20for%20Equifax",
          args: {
            config: step2State.requestData.args.config,
            creditReportId : step2State?.Headers?.requestid,
            // addresses: step2State?.data?.requestData?.addresses[0],
            body: {
              birthDate : step2State?.data?.requestData?.birthDate,
            firstName: step2State?.data?.requestData?.firstName,
            lastName: step2State?.data?.requestData?.lastName,
            middleName: step2State?.data?.requestData?.middleName, 
            ssn: step2State?.data?.requestData?.ssn
            },
          },
          verify: (response, setError) => {
        if (response.StatusCode == 200) {
          return true;
        } else {
              console.log("Error in Step 2: ", response);
              setError(
                "API Call wasn't able to get a valid repsonse. Please try again."
              );
          return false;
        }
          },
        });
      },
    },

    "Step 3": {
      name: "Retrieve Existing Credit Report in CRS Standard Format",
      stepCallback: async (stepState) => {
        const step3State = stepState?.["Step 1"];
        console.log("Step 3", step3State);
        if (!step3State) {
          return workflowCtx.showContent(`⚠️ Unable to find RequestID from Step 1. Please complete Step 1 successfully before proceeding.`);
        }
        await portal.setConfig((defaultConfig) => {
          return {
        ...defaultConfig,
          };
        });
        return workflowCtx.showEndpoint({
          description: `This endpoint retrieves an existing JSON credit report in the CRS Standard Format using the RequestID from Step 1.`,
          endpointPermalink: "$e/CRS%20Standard%20Format/Retrieve%20CRS%20Standard%20Format%20Equifax%20Credit%20Report%20Request", // Example permalink
          args: {
            config: step3State.requestData.args.config,
            creditReportId : step3State?.Headers?.requestid,
            body: {
              birthDate : step3State?.data?.requestData?.birthDate,
            firstName: step3State?.data?.requestData?.firstName,
            lastName: step3State?.data?.requestData?.lastName,
            middleName: step3State?.data?.requestData?.middleName, 
            ssn: step3State?.data?.requestData?.ssn
            },
          },
          verify: (response, setError) => {
            if (response.StatusCode !== 200) {
              setError("Failed to retrieve existing credit report. Please verify the RequestID and try again.");
              return false;
            }
            return true;
          },
        });
      },
    },
  };
}
