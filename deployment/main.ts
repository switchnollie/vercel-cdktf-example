import * as path from "path";
import * as dotenv from "dotenv";
import { Construct } from "constructs";
import { App, TerraformStack, Token } from "cdktf";
import { Project as VercelProject } from "./.gen/providers/vercel/project";
import { Deployment as VercelDeployment } from "./.gen/providers/vercel/deployment";
import { VercelProvider } from "./.gen/providers/vercel/provider";
import { DataVercelProjectDirectory } from "./.gen/providers/vercel/data-vercel-project-directory";

dotenv.config();

const APP_CONFIG = {
  vercelApiToken: process.env.VERCEL_API_TOKEN,
  isProduction: true,
} as const;

interface NextAppStackProps {
  vercelApiToken: string;
  isProduction?: boolean;
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

    const projectDirectory = new DataVercelProjectDirectory(
      this,
      "vercel-project-directory",
      {
        path: path.resolve("../apps/next-app"),
      }
    );

    new VercelDeployment(this, "vercel-deployment", {
      projectId: vercelProject.id,
      files: Token.asStringMap(projectDirectory.files),
      pathPrefix: Token.asString(projectDirectory.path),
      production: props.isProduction,
    });
  }
}
if (!APP_CONFIG.vercelApiToken) {
  throw new Error(
    "Please provide the Vercel API Token as environment variable 'VERCEL_API_TOKEN'"
  );
}
const app = new App();
new NextAppStack(app, "vercel-cdktf-example-app", {
  vercelApiToken: APP_CONFIG.vercelApiToken,
});
app.synth();
