import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { Project as VercelProject } from "./.gen/providers/vercel/project";
import { Deployment as VercelDeployment } from "./.gen/providers/vercel/deployment";
import { VercelProvider } from "./.gen/providers/vercel/provider";
import * as dotenv from "dotenv";

dotenv.config();

const APP_CONFIG = {
  vercelApiToken: process.env.VERCEL_API_TOKEN,
} as const;

interface NextAppStackProps {
  vercelApiToken: string;
}

class NextAppStack extends TerraformStack {
  constructor(scope: Construct, id: string, props: NextAppStackProps) {
    super(scope, id);

    new VercelProvider(this, "vercel-provider", {
      apiToken: props.vercelApiToken,
    });

    const vercelProject = new VercelProject(this, "vercel-project", {
      name: "vercel-cdktf-example",
      framework: "nextjs",
    });

    new VercelDeployment(this, "vercel-deployment", {
      projectId: vercelProject.id,
    });
  }
}
if (!APP_CONFIG.vercelApiToken) {
  throw new Error(
    "Please provide the Vercel API Token as environment variable 'VERCEL_API_TOKEN'"
  );
}
const app = new App();
new NextAppStack(app, "tempBootstrap", {
  vercelApiToken: APP_CONFIG.vercelApiToken,
});
app.synth();
