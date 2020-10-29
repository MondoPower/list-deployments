# deployment-action

A GitHub action to create [Deployments](https://developer.github.com/v3/repos/deployments/) as part of your GitHub CI workflows.

## Action inputs

| name             | description                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `token`          | GitHub token                                                                                                                                                                                                                                                                                                                                                                                                  |
| `environment`    | (Optional) The ref to deploy. This can be a branch, tag, or SHA. More details in the [GitHub deployments API](https://developer.github.com/v3/repos/deployments/#parameters-1). |

## Action outputs

| name            | description                                            |
| --------------- | ------------------------------------------------------ |
| `sha`           | The ID of the deployment as returned by the GitHub API |

## Example usage

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: chrnorm/deployment-action@releases/v1
        name: Create GitHub deployment
        id: deployment
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          environment: production
        # more steps below where you run your deployment scripts inside the same action
```

## Notes

Heads up! Currently, there is a GitHub Actions limitation where events fired _inside_ an action will not trigger further workflows. If you use this action in your workflow, it will **not trigger** any "Deployment" workflows. Thanks to @rclayton-the-terrible for finding a workaround for this:

> While not ideal, if you use a token that is not the Action's GITHUB_TOKEN, this will work. I define a secret called GITHUB_DEPLOY_TOKEN and use that for API calls.

A workaround for this is to create the Deployment, perform the deployment steps, and then trigger an action to create a Deployment Status using my other action: [chrnorm/deployment-status](https://github.com/chrnorm/deployment-status).

For example:

```yaml
name: Deploy

on: [push]

jobs:
  deploy:
    name: Deploy my app

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v1

      - uses: chrnorm/deployment-action@releases/v1
        name: Create GitHub deployment
        id: deployment
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          environment: production

      - name: Deploy my app
        run: |
          # add your deployment code here

      - name: Update deployment status (success)
        if: success()
        uses: chrnorm/deployment-status@releases/v1
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          state: "success"
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}

      - name: Update deployment status (failure)
        if: failure()
        uses: chrnorm/deployment-status@releases/v1
        with:
          token: "${{ github.token }}"
          target_url: http://my-app-url.com
          state: "failure"
          deployment_id: ${{ steps.deployment.outputs.deployment_id }}
```
