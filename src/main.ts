import * as core from "@actions/core";
import * as github from "@actions/github";

type DeploymentState =
  | "error"
  | "failure"
  | "inactive"
  | "in_progress"
  | "queued"
  | "pending"
  | "success";

async function run() {
  try {
    const context = github.context;
    const logUrl = `https://github.com/${context.repo.owner}/${context.repo.repo}/commit/${context.sha}/checks`;

    const token = core.getInput("token", { required: true });
    const environment =
      core.getInput("environment", { required: false }) || "production";

    const client = new github.GitHub(token, { previews: ["flash", "ant-man"] });

    const deployment = await client.repos.listDeployments({
      owner: context.repo.owner,
      repo: context.repo.repo,
      environment: environment,
    })
    
    deployment.data.forEach(a => console.log(a.sha));

    core.setOutput("sha", deployment.data[0].sha);
  } catch (error) {
    core.error(error);
    core.setFailed(error.message);
  }
}

run();
